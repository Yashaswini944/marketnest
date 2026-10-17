import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, useLocation } from 'react-router-dom';

import ProductCard from './ProductCard';
import cartReducer from '../redux/cartSlice';

afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

const product = {
    id: 1,
    title: 'Test Laptop',
    price: 999.99,
    image: 'https://example.com/laptop.jpg',
    category: 'electronics',
};

function LocationDisplay() {
    const location = useLocation();

    return <div data-testid="location">{location.pathname}</div>;
}

function renderProductCard() {
    const store = configureStore({
        reducer: {
            cart: cartReducer,
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <ProductCard product={product} />
                <LocationDisplay />
            </MemoryRouter>
        </Provider>
    );

    return store;
}

describe('ProductCard', () => {
    it('renders the product title', () => {
        renderProductCard();

        expect(
            screen.getByRole('heading', {
                name: 'Test Laptop',
            })
        ).toBeInTheDocument();
    });

    it('renders the product category', () => {
        renderProductCard();

        expect(screen.getByText('electronics')).toBeInTheDocument();
    });

    it('renders the formatted product price', () => {
        renderProductCard();

        expect(screen.getByText('$999.99')).toBeInTheDocument();
    });

    it('renders the product image with accessible alt text', () => {
        renderProductCard();

        const image = screen.getByRole('img', {
            name: 'Test Laptop',
        });

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
            'src',
            'https://example.com/laptop.jpg'
        );
    });

    it('adds the product to the Redux cart when Add to Cart is clicked', async () => {
        const user = userEvent.setup();
        const store = renderProductCard();

        await user.click(
            screen.getByRole('button', {
                name: 'Add to Cart',
            })
        );

        const state = store.getState();

        expect(state.cart.items).toHaveLength(1);
        expect(state.cart.items[0]).toEqual({
            id: 1,
            title: 'Test Laptop',
            price: 999.99,
            image: 'https://example.com/laptop.jpg',
            quantity: 1,
        });

        expect(state.cart.totalPrice).toBe(999.99);
    });

    it('shows Added feedback after adding the product to the cart', async () => {
        const user = userEvent.setup();

        renderProductCard();

        await user.click(
            screen.getByRole('button', {
                name: 'Add to Cart',
            })
        );

        expect(
            screen.getByRole('button', {
                name: 'Added ✓',
            })
        ).toBeInTheDocument();
    });

    it('navigates to the product details page when View Details is clicked', async () => {
        const user = userEvent.setup();

        renderProductCard();

        await user.click(
            screen.getByRole('button', {
                name: 'View details for Test Laptop',
            })
        );

        expect(screen.getByTestId('location')).toHaveTextContent(
            '/product/1'
        );
    });
});