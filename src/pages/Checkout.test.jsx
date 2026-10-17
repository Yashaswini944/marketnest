import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
    MemoryRouter,
    useLocation,
} from 'react-router-dom';

import Checkout from './Checkout';
import cartReducer from '../redux/cartSlice';

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
});

const product = {
    id: 1,
    title: 'Test Laptop',
    price: 100,
    image: 'https://example.com/laptop.jpg',
    quantity: 2,
};

function LocationDisplay() {
    const location = useLocation();

    return (
        <div data-testid="location">
            {location.pathname}
        </div>
    );
}

function renderCheckout(items = [product]) {
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
            <MemoryRouter initialEntries={['/checkout']}>
                <Checkout />
                <LocationDisplay />
            </MemoryRouter>
        </Provider>
    );

    return store;
}

async function fillValidForm(user) {
    await user.type(
        screen.getByLabelText(/First Name/i),
        'John'
    );

    await user.type(
        screen.getByLabelText(/Last Name/i),
        'Doe'
    );

    await user.type(
        screen.getByLabelText(/Email Address/i),
        'john@example.com'
    );

    await user.type(
        screen.getByLabelText(/Street Address/i),
        '123 Main Street'
    );

    await user.type(
        screen.getByLabelText(/^City/i),
        'New York'
    );

    await user.type(
        screen.getByLabelText(/Zip Code/i),
        '10001'
    );

    await user.type(
        screen.getByLabelText(/Demo Card Number/i),
        '1234567890123'
    );
}

describe('Checkout', () => {
    it('shows the empty cart state when there are no products', () => {
        renderCheckout([]);

        expect(
            screen.getByRole('heading', {
                name: 'Your cart is empty',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /Add products to your cart before checking out/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', {
                name: 'Continue Shopping',
            })
        ).toHaveAttribute('href', '/');
    });

    it('renders the checkout form when the cart contains products', () => {
        renderCheckout();

        expect(
            screen.getByRole('heading', {
                name: 'Checkout',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Shipping Information',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Payment Information',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Place Demo Order',
            })
        ).toBeInTheDocument();
    });

    it('displays the cart contents and correct order total', () => {
        renderCheckout();

        expect(
            screen.getByText('Test Laptop')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Qty: 2')
        ).toBeInTheDocument();

        const priceElements =
            screen.getAllByText('$200.00');

        expect(priceElements).toHaveLength(2);

        expect(
            screen.getByRole('link', {
                name: 'Edit Cart',
            })
        ).toHaveAttribute('href', '/cart');
    });

    it('shows an alert when required fields are empty', async () => {
        const user = userEvent.setup();

        const alertSpy = vi
            .spyOn(window, 'alert')
            .mockImplementation(() => { });

        renderCheckout();

        await user.click(
            screen.getByRole('button', {
                name: 'Place Demo Order',
            })
        );

        expect(alertSpy).toHaveBeenCalledWith(
            '❌ Please fill in all fields'
        );
    });

    it('shows an alert when the email address is invalid', async () => {
        const user = userEvent.setup();

        const alertSpy = vi
            .spyOn(window, 'alert')
            .mockImplementation(() => { });

        renderCheckout();

        await user.type(
            screen.getByLabelText(/First Name/i),
            'John'
        );

        await user.type(
            screen.getByLabelText(/Last Name/i),
            'Doe'
        );

        await user.type(
            screen.getByLabelText(/Email Address/i),
            'invalid-email'
        );

        await user.type(
            screen.getByLabelText(/Street Address/i),
            '123 Main Street'
        );

        await user.type(
            screen.getByLabelText(/^City/i),
            'New York'
        );

        await user.type(
            screen.getByLabelText(/Zip Code/i),
            '10001'
        );

        await user.type(
            screen.getByLabelText(/Demo Card Number/i),
            '1234567890123'
        );

        const submitButton = screen.getByRole(
            'button',
            {
                name: 'Place Demo Order',
            }
        );

        const form = submitButton.closest('form');

        fireEvent.submit(form);

        expect(alertSpy).toHaveBeenCalledWith(
            '❌ Please enter a valid email address'
        );
    });

    it('shows an alert when the demo card number is invalid', async () => {
        const user = userEvent.setup();

        const alertSpy = vi
            .spyOn(window, 'alert')
            .mockImplementation(() => { });

        renderCheckout();

        await user.type(
            screen.getByLabelText(/First Name/i),
            'John'
        );

        await user.type(
            screen.getByLabelText(/Last Name/i),
            'Doe'
        );

        await user.type(
            screen.getByLabelText(/Email Address/i),
            'john@example.com'
        );

        await user.type(
            screen.getByLabelText(/Street Address/i),
            '123 Main Street'
        );

        await user.type(
            screen.getByLabelText(/^City/i),
            'New York'
        );

        await user.type(
            screen.getByLabelText(/Zip Code/i),
            '10001'
        );

        await user.type(
            screen.getByLabelText(/Demo Card Number/i),
            '123'
        );

        await user.click(
            screen.getByRole('button', {
                name: 'Place Demo Order',
            })
        );

        expect(alertSpy).toHaveBeenCalledWith(
            '❌ Please enter a valid card number (13-19 digits)'
        );
    });

    it('shows a processing state after submitting valid checkout information', async () => {
        const user = userEvent.setup();

        renderCheckout();

        await fillValidForm(user);

        await user.click(
            screen.getByRole('button', {
                name: 'Place Demo Order',
            })
        );

        const processingButton =
            screen.getByRole('button', {
                name: 'Processing Demo Order...',
            });

        expect(processingButton).toBeDisabled();
    });

    it('places the demo order and clears the Redux cart', async () => {
        const user = userEvent.setup();

        const store = renderCheckout();

        await fillValidForm(user);

        vi.useFakeTimers();

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Place Demo Order',
            })
        );

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1500);
        });

        expect(
            screen.getByRole('heading', {
                name: 'Order Placed!',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Order ID: #/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /Your demo order has been confirmed/i
            )
        ).toBeInTheDocument();

        const state = store.getState();

        expect(state.cart.items).toEqual([]);
        expect(state.cart.totalPrice).toBe(0);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(3000);
        });

        expect(
            screen.getByTestId('location')
        ).toHaveTextContent('/');
    });
});