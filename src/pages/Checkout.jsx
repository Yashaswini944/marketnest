import { useState } from 'react';
import {
    useDispatch,
    useSelector,
} from 'react-redux';
import {
    Link,
    useNavigate,
} from 'react-router-dom';

import { clearCart } from '../redux/cartSlice';

function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { items, totalPrice } = useSelector(
        (state) => state.cart
    );

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
    });

    const [orderPlaced, setOrderPlaced] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [orderId, setOrderId] =
        useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const {
            firstName,
            lastName,
            email,
            address,
            city,
            zipCode,
            cardNumber,
        } = formData;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !address ||
            !city ||
            !zipCode ||
            !cardNumber
        ) {
            alert('❌ Please fill in all fields');
            return false;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert(
                '❌ Please enter a valid email address'
            );

            return false;
        }

        const normalizedCardNumber =
            cardNumber.replace(/\s/g, '');

        if (
            !/^\d+$/.test(normalizedCardNumber) ||
            normalizedCardNumber.length < 13 ||
            normalizedCardNumber.length > 19
        ) {
            alert(
                '❌ Please enter a valid card number (13-19 digits)'
            );

            return false;
        }

        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        window.setTimeout(() => {
            const generatedOrderId = Math.floor(
                10000 + Math.random() * 90000
            );

            setOrderId(generatedOrderId);
            setOrderPlaced(true);

            dispatch(clearCart());

            setLoading(false);

            window.setTimeout(() => {
                navigate('/');
            }, 3000);
        }, 1500);
    };

    if (items.length === 0 && !orderPlaced) {
        return (
            <main className="checkout">
                <div className="empty-cart">
                    <h1>Your cart is empty</h1>

                    <p>
                        Add products to your cart before
                        checking out.
                    </p>

                    <Link
                        to="/"
                        className="checkout-btn"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    if (orderPlaced) {
        return (
            <main className="checkout">
                <div className="order-success">
                    <div
                        className="success-icon"
                        aria-hidden="true"
                    >
                        ✓
                    </div>

                    <h1>Order Placed!</h1>

                    <p className="order-id">
                        Order ID: #{orderId}
                    </p>

                    <p className="order-message">
                        Thank you for your purchase. Your
                        demo order has been confirmed.
                    </p>

                    <p className="redirect-message">
                        Redirecting to home in 3 seconds...
                    </p>

                    <Link
                        to="/"
                        className="home-btn"
                    >
                        Go to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout">
            <h1>Checkout</h1>

            <p className="checkout-demo-message">
                Demo checkout — no real payment is
                processed.
            </p>

            <div className="checkout-wrapper">
                <section className="checkout-form-section">
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h2>Shipping Information</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">
                                        First Name *
                                    </label>

                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="John"
                                        autoComplete="given-name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">
                                        Last Name *
                                    </label>

                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Doe"
                                        autoComplete="family-name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    Email Address *
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">
                                    Street Address *
                                </label>

                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="123 Main Street"
                                    autoComplete="street-address"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">
                                        City *
                                    </label>

                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="New York"
                                        autoComplete="address-level2"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="zipCode">
                                        Zip Code *
                                    </label>

                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="10001"
                                        autoComplete="postal-code"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Payment Information</h2>

                            <div className="form-group">
                                <label htmlFor="cardNumber">
                                    Demo Card Number *
                                </label>

                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="22"
                                    inputMode="numeric"
                                    autoComplete="off"
                                />
                            </div>

                            <p className="test-card-info">
                                Demo mode only. Use any 13-19
                                digit number. No payment
                                information is submitted or
                                processed.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="place-order-btn"
                            disabled={loading}
                        >
                            {loading
                                ? 'Processing Demo Order...'
                                : 'Place Demo Order'}
                        </button>
                    </form>
                </section>

                <aside className="order-summary-section">
                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-items">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="summary-item"
                                >
                                    <div className="summary-item-info">
                                        <p>{item.title}</p>

                                        <p className="item-qty">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="item-price">
                                        $
                                        {(
                                            item.price * item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-total">
                            <span className="total-label">
                                Total:
                            </span>

                            <span className="total-amount">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>

                        <Link
                            to="/cart"
                            className="edit-cart-btn"
                        >
                            Edit Cart
                        </Link>
                    </div>
                </aside>
            </div>
        </main>
    );
}

export default Checkout;