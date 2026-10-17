import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    cleanup,
    render,
    screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Home from './Home';
import { productService } from '../services/productService';

vi.mock('../services/productService', () => ({
    productService: {
        getAllProducts: vi.fn(),
    },
}));

vi.mock('../components/ProductCard', () => ({
    default: ({ product }) => (
        <article data-testid={`product-${product.id}`}>
            <h2>{product.title}</h2>
            <p>${product.price.toFixed(2)}</p>
            <p>{product.category}</p>
        </article>
    ),
}));

vi.mock('../components/Pagination', () => ({
    default: ({
        currentPage,
        totalPages,
        onPageChange,
    }) => (
        <div data-testid="pagination">
            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button
                type="button"
                onClick={() =>
                    onPageChange(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
            >
                Next
            </button>
        </div>
    ),
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

const products = [
    {
        id: 1,
        title: 'Laptop',
        price: 900,
        category: 'electronics',
        image: 'laptop.jpg',
    },
    {
        id: 2,
        title: 'Headphones',
        price: 100,
        category: 'electronics',
        image: 'headphones.jpg',
    },
    {
        id: 3,
        title: 'Gold Ring',
        price: 300,
        category: 'jewelery',
        image: 'ring.jpg',
    },
    {
        id: 4,
        title: 'Blue Shirt',
        price: 50,
        category: 'clothing',
        image: 'shirt.jpg',
    },
];

function mockSuccessfulProducts(
    data = products
) {
    productService.getAllProducts.mockResolvedValue(
        data
    );
}

describe('Home', () => {
    it('shows a loading state while products are being loaded', () => {
        productService.getAllProducts.mockReturnValue(
            new Promise(() => { })
        );

        render(<Home />);

        expect(
            screen.getByRole('status')
        ).toHaveTextContent(
            'Loading products...'
        );
    });

    it('loads and displays products successfully', async () => {
        mockSuccessfulProducts();

        render(<Home />);

        expect(
            await screen.findByText('Laptop')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Headphones')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Gold Ring')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Blue Shirt')
        ).toBeInTheDocument();

        expect(
            screen.getByText('4 products found')
        ).toBeInTheDocument();

        expect(
            productService.getAllProducts
        ).toHaveBeenCalledTimes(1);
    });

    it('creates category filter options from loaded products', async () => {
        mockSuccessfulProducts();

        render(<Home />);

        const categorySelect =
            await screen.findByLabelText(
                'Filter products by category'
            );

        expect(
            screen.getByRole('option', {
                name: 'All categories',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('option', {
                name: 'electronics',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('option', {
                name: 'jewelery',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('option', {
                name: 'clothing',
            })
        ).toBeInTheDocument();

        expect(categorySelect).toHaveValue('all');
    });

    it('filters products using the search box', async () => {
        const user = userEvent.setup();

        mockSuccessfulProducts();

        render(<Home />);

        const searchInput =
            await screen.findByLabelText(
                'Search products'
            );

        await user.type(searchInput, 'laptop');

        expect(
            screen.getByText('Laptop')
        ).toBeInTheDocument();

        expect(
            screen.queryByText('Headphones')
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText('Gold Ring')
        ).not.toBeInTheDocument();

        expect(
            screen.getByText('1 product found')
        ).toBeInTheDocument();
    });

    it('filters products by category', async () => {
        const user = userEvent.setup();

        mockSuccessfulProducts();

        render(<Home />);

        const categorySelect =
            await screen.findByLabelText(
                'Filter products by category'
            );

        await user.selectOptions(
            categorySelect,
            'electronics'
        );

        expect(
            screen.getByText('Laptop')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Headphones')
        ).toBeInTheDocument();

        expect(
            screen.queryByText('Gold Ring')
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText('Blue Shirt')
        ).not.toBeInTheDocument();

        expect(
            screen.getByText('2 products found')
        ).toBeInTheDocument();
    });

    it('sorts products from lowest price to highest price', async () => {
        const user = userEvent.setup();

        mockSuccessfulProducts();

        render(<Home />);

        const sortSelect =
            await screen.findByLabelText(
                'Sort products'
            );

        await user.selectOptions(
            sortSelect,
            'price-low-high'
        );

        const renderedProducts =
            screen.getAllByTestId(/^product-/);

        expect(renderedProducts[0]).toHaveTextContent(
            'Blue Shirt'
        );

        expect(renderedProducts[1]).toHaveTextContent(
            'Headphones'
        );

        expect(renderedProducts[2]).toHaveTextContent(
            'Gold Ring'
        );

        expect(renderedProducts[3]).toHaveTextContent(
            'Laptop'
        );
    });

    it('sorts products from highest price to lowest price', async () => {
        const user = userEvent.setup();

        mockSuccessfulProducts();

        render(<Home />);

        const sortSelect =
            await screen.findByLabelText(
                'Sort products'
            );

        await user.selectOptions(
            sortSelect,
            'price-high-low'
        );

        const renderedProducts =
            screen.getAllByTestId(/^product-/);

        expect(renderedProducts[0]).toHaveTextContent(
            'Laptop'
        );

        expect(renderedProducts[1]).toHaveTextContent(
            'Gold Ring'
        );

        expect(renderedProducts[2]).toHaveTextContent(
            'Headphones'
        );

        expect(renderedProducts[3]).toHaveTextContent(
            'Blue Shirt'
        );
    });

    it('sorts products alphabetically by name', async () => {
        const user = userEvent.setup();

        mockSuccessfulProducts();

        render(<Home />);

        const sortSelect =
            await screen.findByLabelText(
                'Sort products'
            );

        await user.selectOptions(
            sortSelect,
            'name'
        );

        const renderedProducts =
            screen.getAllByTestId(/^product-/);

        expect(renderedProducts[0]).toHaveTextContent(
            'Blue Shirt'
        );

        expect(renderedProducts[1]).toHaveTextContent(
            'Gold Ring'
        );

        expect(renderedProducts[2]).toHaveTextContent(
            'Headphones'
        );

        expect(renderedProducts[3]).toHaveTextContent(
            'Laptop'
        );
    });

    it('shows a no-products message when filters return no matches', async () => {
        const user = userEvent.setup();

        mockSuccessfulProducts();

        render(<Home />);

        const searchInput =
            await screen.findByLabelText(
                'Search products'
            );

        await user.type(
            searchInput,
            'product-that-does-not-exist'
        );

        expect(
            screen.getByRole('heading', {
                name: 'No products found',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                'Try changing your search or category.'
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText('0 products found')
        ).toBeInTheDocument();
    });

    it('shows an error state when loading products fails', async () => {
        productService.getAllProducts.mockRejectedValue(
            new Error('Network error')
        );

        render(<Home />);

        expect(
            await screen.findByRole('alert')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Something went wrong',
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
    });

    it('uses the fallback error message when an error has no message', async () => {
        productService.getAllProducts.mockRejectedValue(
            {}
        );

        render(<Home />);

        expect(
            await screen.findByText(
                'Unable to load products.'
            )
        ).toBeInTheDocument();
    });

    it('retries loading products after an error', async () => {
        const user = userEvent.setup();

        productService.getAllProducts
            .mockRejectedValueOnce(
                new Error('Network error')
            )
            .mockResolvedValueOnce(products);

        render(<Home />);

        const retryButton =
            await screen.findByRole('button', {
                name: 'Try Again',
            });

        await user.click(retryButton);

        expect(
            await screen.findByText('Laptop')
        ).toBeInTheDocument();

        expect(
            screen.getByText('4 products found')
        ).toBeInTheDocument();

        expect(
            productService.getAllProducts
        ).toHaveBeenCalledTimes(2);
    });

    it('displays pagination when there is more than one page of products', async () => {
        const manyProducts = Array.from(
            { length: 10 },
            (_, index) => ({
                id: index + 1,
                title: `Product ${index + 1}`,
                price: (index + 1) * 10,
                category: 'test',
                image: `product-${index + 1}.jpg`,
            })
        );

        mockSuccessfulProducts(manyProducts);

        render(<Home />);

        expect(
            await screen.findByTestId('pagination')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Page 1 of 2')
        ).toBeInTheDocument();

        expect(
            screen.getAllByTestId(/^product-/)
        ).toHaveLength(8);
    });

    it('changes pages using pagination', async () => {
        const user = userEvent.setup();

        const manyProducts = Array.from(
            { length: 10 },
            (_, index) => ({
                id: index + 1,
                title: `Product ${index + 1}`,
                price: (index + 1) * 10,
                category: 'test',
                image: `product-${index + 1}.jpg`,
            })
        );

        mockSuccessfulProducts(manyProducts);

        render(<Home />);

        const nextButton =
            await screen.findByRole('button', {
                name: 'Next',
            });

        await user.click(nextButton);

        expect(
            screen.getByText('Page 2 of 2')
        ).toBeInTheDocument();

        expect(
            screen.getAllByTestId(/^product-/)
        ).toHaveLength(2);

        expect(
            screen.getByText('Product 9')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Product 10')
        ).toBeInTheDocument();
    });

    it('resets pagination to page one when the search changes', async () => {
        const user = userEvent.setup();

        const manyProducts = Array.from(
            { length: 10 },
            (_, index) => ({
                id: index + 1,
                title: `Product ${index + 1}`,
                price: (index + 1) * 10,
                category:
                    index < 5 ? 'first' : 'second',
                image: `product-${index + 1}.jpg`,
            })
        );

        mockSuccessfulProducts(manyProducts);

        render(<Home />);

        const nextButton =
            await screen.findByRole('button', {
                name: 'Next',
            });

        await user.click(nextButton);

        expect(
            screen.getByText('Page 2 of 2')
        ).toBeInTheDocument();

        const searchInput =
            screen.getByLabelText('Search products');

        await user.type(searchInput, 'Product');

        expect(
            screen.getByText('Page 1 of 2')
        ).toBeInTheDocument();
    });
});