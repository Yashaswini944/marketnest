import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import {
    cleanup,
    render,
    screen,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
    MemoryRouter,
} from 'react-router-dom';

import Header from './Header';
import cartReducer from '../redux/cartSlice';

afterEach(() => {
    cleanup();
});

function renderHeader({
    items = [],
    initialEntry = '/',
} = {}) {
    const totalPrice = items.reduce(
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
                items,
                totalPrice,
            },
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter
                initialEntries={[initialEntry]}
            >
                <Header />
            </MemoryRouter>
        </Provider>
    );

    return store;
}

describe('Header', () => {
    it('renders the marketnest home logo', () => {
        renderHeader();

        const logo = screen.getByRole('link', {
            name: 'MarketNest home',
        });

        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('href', '/');
    });

    it('renders the main navigation links', () => {
        renderHeader();

        expect(
            screen.getByRole('navigation', {
                name: 'Main navigation',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', {
                name: 'Home',
            })
        ).toHaveAttribute('href', '/');

        expect(
            screen.getByRole('link', {
                name: /Cart/i,
            })
        ).toHaveAttribute('href', '/cart');
    });

    it('shows zero items when the cart is empty', () => {
        renderHeader();

        expect(
            screen.getByLabelText(
                '0 items in cart'
            )
        ).toHaveTextContent('0');
    });

    it('calculates the total cart quantity', () => {
        const items = [
            {
                id: 1,
                title: 'Laptop',
                price: 100,
                quantity: 2,
            },
            {
                id: 2,
                title: 'Headphones',
                price: 50,
                quantity: 3,
            },
        ];

        renderHeader({ items });

        expect(
            screen.getByLabelText(
                '5 items in cart'
            )
        ).toHaveTextContent('5');
    });

    it('marks Home as active on the home route', () => {
        renderHeader({
            initialEntry: '/',
        });

        const homeLink =
            screen.getByRole('link', {
                name: 'Home',
            });

        const cartLink =
            screen.getByRole('link', {
                name: /Cart/i,
            });

        expect(homeLink).toHaveClass(
            'nav-link',
            'active'
        );

        expect(cartLink).not.toHaveClass(
            'active'
        );
    });

    it('marks Cart as active on the cart route', () => {
        renderHeader({
            initialEntry: '/cart',
        });

        const homeLink =
            screen.getByRole('link', {
                name: 'Home',
            });

        const cartLink =
            screen.getByRole('link', {
                name: /Cart/i,
            });

        expect(cartLink).toHaveClass(
            'nav-link',
            'cart-link',
            'active'
        );

        expect(homeLink).not.toHaveClass(
            'active'
        );
    });
});