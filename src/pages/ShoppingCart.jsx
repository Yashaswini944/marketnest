import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    removeFromCart,
    updateQuantity,
} from '../redux/cartSlice';

function ShoppingCart() {
    const dispatch = useDispatch();

    const { items, totalPrice } = useSelector(
        (state) => state.cart
    );

    const itemCount = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const updateItemQuantity = (id, quantity) => {
        if (quantity < 1) {
            dispatch(removeFromCart(id));
            return;
        }

        dispatch(
            updateQuantity({
                id,
                quantity,
            })
        );
    };

    if (items.length === 0) {
        return (
            <main className="shopping-cart">
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>

                    <h1>Your cart is empty</h1>

                    <p>
                        Add some products and they will appear here.
                    </p>

                    <Link to="/" className="checkout-btn">
                        Browse Products
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="shopping-cart">
            <div className="cart-page-header">
                <div>
                    <h1>Shopping Cart</h1>

                    <p>
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                </div>

                <Link to="/" className="continue-shopping-link">
                    ← Continue Shopping
                </Link>
            </div>

            <div className="cart-layout">
                <section
                    className="cart-items"
                    aria-label="Shopping cart items"
                >
                    {items.map((item) => (
                        <article key={item.id} className="cart-item">
                            <div className="cart-item-image">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                />
                            </div>

                            <div className="cart-item-content">
                                <h2>{item.title}</h2>

                                <p className="cart-unit-price">
                                    ${item.price.toFixed(2)} each
                                </p>

                                <button
                                    type="button"
                                    className="remove-link"
                                    onClick={() =>
                                        dispatch(removeFromCart(item.id))
                                    }
                                >
                                    Remove
                                </button>
                            </div>

                            <div
                                className="quantity-control"
                                aria-label={`Quantity for ${item.title}`}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateItemQuantity(
                                            item.id,
                                            item.quantity - 1
                                        )
                                    }
                                    aria-label={`Decrease quantity of ${item.title}`}
                                >
                                    −
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateItemQuantity(
                                            item.id,
                                            item.quantity + 1
                                        )
                                    }
                                    aria-label={`Increase quantity of ${item.title}`}
                                >
                                    +
                                </button>
                            </div>

                            <div className="cart-item-total">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </article>
                    ))}
                </section>

                <aside className="cart-summary">
                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Items</span>
                        <span>{itemCount}</span>
                    </div>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>Demo</span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <Link to="/checkout" className="checkout-btn">
                        Continue to Checkout
                    </Link>

                    <p className="checkout-note">
                        Demo checkout — no real payment is processed.
                    </p>
                </aside>
            </div>
        </main>
    );
}

export default ShoppingCart;