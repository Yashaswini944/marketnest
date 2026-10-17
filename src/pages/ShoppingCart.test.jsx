import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import ShoppingCart from './ShoppingCart';
import cartReducer from '../redux/cartSlice';

afterEach(() => {
    cleanup();
});

const product = {
    id: 1,
    title: 'Test Laptop',
    price: 100,
    image: 'https://example.com/laptop.jpg',
    quantity: 2,
};

const secondProduct = {
    id: 2,
    title: 'Test Headphones',
    price: 50,
    image: 'https://example.com/headphones.jpg',
    quantity: 1,
};

function renderShoppingCart(items = []) {
    const totalPrice = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const store = configureStore({
        reducer: {
            cart: cartReducer,
        },
        preloadedState: {
            cart: {
                items,
                totalPrice,
            },
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <ShoppingCart />
            </MemoryRouter>
        </Provider>
    );

    return store;
}

describe('ShoppingCart', () => {
    it('renders the empty cart state when there are no products', () => {
        renderShoppingCart();

        expect(
            screen.getByRole('heading', {
                name: 'Your cart is empty',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                'Add some products and they will appear here.'
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', {
                name: 'Browse Products',
            })
        ).toHaveAttribute('href', '/');
    });

    it('renders products currently in the cart', () => {
        renderShoppingCart([product, secondProduct]);

        expect(
            screen.getByRole('heading', {
                name: 'Test Laptop',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Test Headphones',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('img', {
                name: 'Test Laptop',
            })
        ).toHaveAttribute(
            'src',
            'https://example.com/laptop.jpg'
        );
    });

    it('displays the total number of items including quantities', () => {
        renderShoppingCart([product, secondProduct]);

        expect(screen.getByText('3 items')).toBeInTheDocument();
    });

    it('displays the correct subtotal and total', () => {
        renderShoppingCart([product, secondProduct]);

        const priceElements = screen.getAllByText('$250.00');

        expect(priceElements).toHaveLength(2);
    });

    it('increases a product quantity', async () => {
        const user = userEvent.setup();
        const store = renderShoppingCart([product]);

        await user.click(
            screen.getByRole('button', {
                name: 'Increase quantity of Test Laptop',
            })
        );

        const state = store.getState();

        expect(state.cart.items[0].quantity).toBe(3);
        expect(state.cart.totalPrice).toBe(300);

        expect(screen.getByText('3 items')).toBeInTheDocument();
    });

    it('decreases a product quantity', async () => {
        const user = userEvent.setup();
        const store = renderShoppingCart([product]);

        await user.click(
            screen.getByRole('button', {
                name: 'Decrease quantity of Test Laptop',
            })
        );

        const state = store.getState();

        expect(state.cart.items[0].quantity).toBe(1);
        expect(state.cart.totalPrice).toBe(100);

        expect(screen.getByText('1 item')).toBeInTheDocument();
    });

    it('removes a product when Remove is clicked', async () => {
        const user = userEvent.setup();
        const store = renderShoppingCart([product]);

        await user.click(
            screen.getByRole('button', {
                name: 'Remove',
            })
        );

        const state = store.getState();

        expect(state.cart.items).toHaveLength(0);
        expect(state.cart.totalPrice).toBe(0);

        expect(
            screen.getByRole('heading', {
                name: 'Your cart is empty',
            })
        ).toBeInTheDocument();
    });

    it('removes a product when its quantity is decreased from one to zero', async () => {
        const user = userEvent.setup();

        const singleQuantityProduct = {
            ...product,
            quantity: 1,
        };

        const store = renderShoppingCart([
            singleQuantityProduct,
        ]);

        await user.click(
            screen.getByRole('button', {
                name: 'Decrease quantity of Test Laptop',
            })
        );

        const state = store.getState();

        expect(state.cart.items).toHaveLength(0);
        expect(state.cart.totalPrice).toBe(0);

        expect(
            screen.getByRole('heading', {
                name: 'Your cart is empty',
            })
        ).toBeInTheDocument();
    });
});