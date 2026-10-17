import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';

function ProductCard({ product }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
            })
        );

        setAdded(true);

        window.setTimeout(() => {
            setAdded(false);
        }, 1500);
    };

    const handleViewDetails = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <article className="product-card">
            <div className="product-image-wrapper">
                <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                />
            </div>

            <div className="product-info">
                <p className="product-category">
                    {product.category}
                </p>

                <h2>{product.title}</h2>

                <p className="product-price">
                    ${product.price.toFixed(2)}
                </p>

                <div className="product-buttons">
                    <button
                        type="button"
                        onClick={handleViewDetails}
                        className="view-details-btn"
                        aria-label={`View details for ${product.title}`}
                    >
                        View Details
                    </button>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="add-to-cart-btn"
                    >
                        {added ? 'Added ✓' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;