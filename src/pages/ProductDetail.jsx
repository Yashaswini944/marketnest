import { useEffect, useState } from 'react';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { addToCart } from '../redux/cartSlice';
import { productService } from '../services/productService';

function ProductDetail() {
    const { id } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addedToCart, setAddedToCart] =
        useState(false);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError('');

            const data =
                await productService.getProductById(id);

            setProduct(data);
        } catch (err) {
            setError(
                err.message ||
                'Unable to load this product.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let ignore = false;

        const loadProduct = async () => {
            try {
                const data =
                    await productService.getProductById(id);

                if (!ignore) {
                    setProduct(data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.message ||
                        'Unable to load this product.'
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadProduct();

        return () => {
            ignore = true;
        };
    }, [id]);

    const handleAddToCart = () => {
        if (!product) {
            return;
        }

        dispatch(
            addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
            })
        );

        setAddedToCart(true);

        window.setTimeout(() => {
            setAddedToCart(false);
        }, 1500);
    };

    if (loading) {
        return (
            <main
                className="page-state"
                role="status"
            >
                <div className="loading">
                    Loading product...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page-state">
                <div
                    className="error-state"
                    role="alert"
                >
                    <h1>Unable to load product</h1>

                    <p>{error}</p>

                    <div className="error-actions">
                        <button
                            type="button"
                            onClick={fetchProduct}
                        >
                            Try Again
                        </button>

                        <Link to="/">
                            Back to Products
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="page-state">
                <h1>Product not found</h1>

                <Link to="/">
                    Back to Products
                </Link>
            </main>
        );
    }

    return (
        <main className="product-detail">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="back-button"
            >
                ← Back to products
            </button>

            <article className="product-detail-content">
                <div className="product-detail-image">
                    <img
                        src={product.image}
                        alt={product.title}
                    />
                </div>

                <div className="product-detail-info">
                    <span className="product-category">
                        {product.category}
                    </span>

                    <h1 className="product-detail-title">
                        {product.title}
                    </h1>

                    {product.rating && (
                        <div
                            className="product-rating"
                            aria-label={`Rated ${product.rating.rate} out of 5 from ${product.rating.count} reviews`}
                        >
                            <span>
                                ★ {product.rating.rate}
                            </span>

                            <span>
                                {product.rating.count} reviews
                            </span>
                        </div>
                    )}

                    <div className="product-detail-price">
                        ${product.price.toFixed(2)}
                    </div>

                    <div className="product-description-section">
                        <h2>About this product</h2>

                        <p className="product-description">
                            {product.description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`detail-add-to-cart ${addedToCart ? 'added' : ''
                            }`}
                    >
                        {addedToCart
                            ? 'Added to Cart ✓'
                            : 'Add to Cart'}
                    </button>
                </div>
            </article>
        </main>
    );
}

export default ProductDetail;