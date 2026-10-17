import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
    const cartItems = useSelector((state) => state.cart.items);

    const itemCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <header className="header">
            <div className="header-content">
                <NavLink
                    to="/"
                    className="logo"
                    aria-label="MarketNest home"
                >
                    <span className="logo-mark">M</span>
                    <span className="logo-market">arket</span>
                    <span className="logo-n">N</span>
                    <span className="logo-est">est</span>
                </NavLink>

                <nav className="nav" aria-label="Main navigation">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `nav-link cart-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span>Cart</span>

                        <span
                            className="cart-count"
                            aria-label={`${itemCount} items in cart`}
                        >
                            {itemCount}
                        </span>
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Header;