import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
    MemoryRouter,
    Route,
    Routes,
} from 'react-router-dom';

import ProductDetail from './ProductDetail';
import cartReducer from '../redux/cartSlice';
import { productService } from '../services/productService';

vi.mock('../services/productService', () => ({
    productService: {
        getProductById: vi.fn(),
    },
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
});

const product = {
    id: 1,
    title: 'Test Laptop',
    price: 999.99,
    image: 'https://example.com/laptop.jpg',
    category: 'electronics',
    description: 'A powerful laptop for testing.',
    rating: {
        rate: 4.5,
        count: 120,
    },
};

function renderProductDetail({
    initialEntry = '/product/1',
    preloadedItems = [],
} = {}) {
    const totalPrice = preloadedItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const store = configureStore({
        reducer: {
            cart: cartReducer,
        },
        preloadedState: {
            cart: {
                items: preloadedItems,
                totalPrice,
            },
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter
                initialEntries={[
                    '/',
                    initialEntry,
                ]}
                initialIndex={1}
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div>Products Home</div>
                        }
                    />

                    <Route
                        path="/product/:id"
                        element={<ProductDetail />}
                    />
                </Routes>
            </MemoryRouter>
        </Provider>
    );

    return store;
}

describe('ProductDetail', () => {
    it('shows a loading state while the product is being loaded', () => {
        productService.getProductById.mockReturnValue(
            new Promise(() => { })
        );

        renderProductDetail();

        expect(
            screen.getByRole('status')
        ).toHaveTextContent(
            'Loading product...'
        );
    });

    it('loads and displays the product details', async () => {
        productService.getProductById.mockResolvedValue(
            product
        );

        renderProductDetail();

        expect(
            await screen.findByRole('heading', {
                name: 'Test Laptop',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText('electronics')
        ).toBeInTheDocument();

        expect(
            screen.getByText('$999.99')
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                'A powerful laptop for testing.'
            )
        ).toBeInTheDocument();

        const image = screen.getByRole('img', {
            name: 'Test Laptop',
        });

        expect(image).toHaveAttribute(
            'src',
            'https://example.com/laptop.jpg'
        );

        expect(
            productService.getProductById
        ).toHaveBeenCalledWith('1');
    });

    it('displays product rating information when rating exists', async () => {
        productService.getProductById.mockResolvedValue(
            product
        );

        renderProductDetail();

        const rating = await screen.findByLabelText(
            'Rated 4.5 out of 5 from 120 reviews'
        );

        expect(rating).toBeInTheDocument();

        expect(
            screen.getByText('★ 4.5')
        ).toBeInTheDocument();

        expect(
            screen.getByText('120 reviews')
        ).toBeInTheDocument();
    });

    it('renders successfully when the product has no rating', async () => {
        productService.getProductById.mockResolvedValue({
            ...product,
            rating: undefined,
        });

        renderProductDetail();

        expect(
            await screen.findByRole('heading', {
                name: 'Test Laptop',
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByText('120 reviews')
        ).not.toBeInTheDocument();
    });

    it('shows an error state when loading the product fails', async () => {
        productService.getProductById.mockRejectedValue(
            new Error('Network error')
        );

        renderProductDetail();

        expect(
            await screen.findByRole('alert')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Unable to load product',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText('Network error')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Try Again',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', {
                name: 'Back to Products',
            })
        ).toHaveAttribute('href', '/');
    });

    it('uses the fallback error message when an error has no message', async () => {
        productService.getProductById.mockRejectedValue(
            {}
        );

        renderProductDetail();

        expect(
            await screen.findByText(
                'Unable to load this product.'
            )
        ).toBeInTheDocument();
    });

    it('retries loading the product after an error', async () => {
        const user = userEvent.setup();

        productService.getProductById
            .mockRejectedValueOnce(
                new Error('Network error')
            )
            .mockResolvedValueOnce(product);

        renderProductDetail();

        const retryButton =
            await screen.findByRole('button', {
                name: 'Try Again',
            });

        await user.click(retryButton);

        expect(
            await screen.findByRole('heading', {
                name: 'Test Laptop',
            })
        ).toBeInTheDocument();

        expect(
            productService.getProductById
        ).toHaveBeenCalledTimes(2);
    });

    it('shows product not found when the API returns no product', async () => {
        productService.getProductById.mockResolvedValue(
            null
        );

        renderProductDetail();

        expect(
            await screen.findByRole('heading', {
                name: 'Product not found',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', {
                name: 'Back to Products',
            })
        ).toHaveAttribute('href', '/');
    });

    it('adds the product to the Redux cart and shows feedback', async () => {
        const user = userEvent.setup();

        productService.getProductById.mockResolvedValue(
            product
        );

        const store = renderProductDetail();

        const addButton =
            await screen.findByRole('button', {
                name: 'Add to Cart',
            });

        await user.click(addButton);

        const state = store.getState();

        expect(state.cart.items).toHaveLength(1);

        expect(state.cart.items[0]).toEqual({
            id: 1,
            title: 'Test Laptop',
            price: 999.99,
            image: 'https://example.com/laptop.jpg',
            quantity: 1,
        });

        expect(state.cart.totalPrice).toBe(
            999.99
        );

        expect(
            screen.getByRole('button', {
                name: 'Added to Cart ✓',
            })
        ).toBeInTheDocument();
    });

    it('resets the added-to-cart feedback after 1.5 seconds', async () => {
        productService.getProductById.mockResolvedValue(
            product
        );

        renderProductDetail();

        const addButton =
            await screen.findByRole('button', {
                name: 'Add to Cart',
            });

        vi.useFakeTimers();

        fireEvent.click(addButton);

        expect(
            screen.getByRole('button', {
                name: 'Added to Cart ✓',
            })
        ).toBeInTheDocument();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1500);
        });

        expect(
            screen.getByRole('button', {
                name: 'Add to Cart',
            })
        ).toBeInTheDocument();
    });

    it('navigates back when the back button is clicked', async () => {
        const user = userEvent.setup();

        productService.getProductById.mockResolvedValue(
            product
        );

        renderProductDetail();

        const backButton =
            await screen.findByRole('button', {
                name: '← Back to products',
            });

        await user.click(backButton);

        expect(
            screen.getByText('Products Home')
        ).toBeInTheDocument();
    });
});