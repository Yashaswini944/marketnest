import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { productService } from '../services/productService';

function Home() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] =
        useState('all');
    const [sortOption, setSortOption] = useState('default');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const productsPerPage = 8;

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await productService.getAllProducts();

            setProducts(data);
        } catch (err) {
            setError(
                err.message || 'Unable to load products.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let ignore = false;

        const loadProducts = async () => {
            try {
                const data =
                    await productService.getAllProducts();

                if (!ignore) {
                    setProducts(data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.message ||
                        'Unable to load products.'
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            ignore = true;
        };
    }, []);

    const categories = useMemo(() => {
        return [
            ...new Set(
                products.map((product) => product.category)
            ),
        ];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = products.filter((product) => {
            const matchesSearch = product.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesCategory =
                selectedCategory === 'all' ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        if (sortOption === 'price-low-high') {
            result = [...result].sort(
                (a, b) => a.price - b.price
            );
        }

        if (sortOption === 'price-high-low') {
            result = [...result].sort(
                (a, b) => b.price - a.price
            );
        }

        if (sortOption === 'name') {
            result = [...result].sort((a, b) =>
                a.title.localeCompare(b.title)
            );
        }

        return result;
    }, [
        products,
        searchTerm,
        selectedCategory,
        sortOption,
    ]);

    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    const paginatedProducts = useMemo(() => {
        const startIndex =
            (currentPage - 1) * productsPerPage;

        return filteredProducts.slice(
            startIndex,
            startIndex + productsPerPage
        );
    }, [filteredProducts, currentPage]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="home">
            <section className="catalog-header">
                <div>
                    <h1>Explore Products</h1>

                    <p>
                        Browse our collection and find products
                        that match your needs.
                    </p>
                </div>
            </section>

            {!loading && !error && (
                <section
                    className="product-controls"
                    aria-label="Product filters"
                >
                    <input
                        type="search"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearch}
                        aria-label="Search products"
                    />

                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        aria-label="Filter products by category"
                    >
                        <option value="all">
                            All categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        aria-label="Sort products"
                    >
                        <option value="default">
                            Sort by
                        </option>

                        <option value="price-low-high">
                            Price: Low to High
                        </option>

                        <option value="price-high-low">
                            Price: High to Low
                        </option>

                        <option value="name">
                            Name: A-Z
                        </option>
                    </select>
                </section>
            )}

            {loading && (
                <div className="loading" role="status">
                    Loading products...
                </div>
            )}

            {!loading && error && (
                <div className="error-state" role="alert">
                    <h2>Something went wrong</h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={fetchProducts}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="results-summary">
                        {filteredProducts.length}{' '}
                        {filteredProducts.length === 1
                            ? 'product'
                            : 'products'}{' '}
                        found
                    </div>

                    {paginatedProducts.length === 0 ? (
                        <div className="no-products">
                            <h2>No products found</h2>

                            <p>
                                Try changing your search or
                                category.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="products-grid">
                                {paginatedProducts.map(
                                    (product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    )
                                )}
                            </div>

                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </main>
    );
}

export default Home;