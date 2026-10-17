function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (totalPages <= 1) {
        return null;
    }

    const changePage = (page) => {
        if (
            page >= 1 &&
            page <= totalPages &&
            page !== currentPage
        ) {
            onPageChange(page);

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const maxVisible = 5;

    let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisible / 2)
    );

    const endPage = Math.min(
        totalPages,
        startPage + maxVisible - 1
    );

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(
            1,
            endPage - maxVisible + 1
        );
    }

    const pageNumbers = [];

    for (let page = startPage; page <= endPage; page += 1) {
        pageNumbers.push(page);
    }

    return (
        <nav
            className="pagination"
            aria-label="Product pagination"
        >
            <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
            >
                ← Previous
            </button>

            {startPage > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => changePage(1)}
                        aria-label="Go to page 1"
                    >
                        1
                    </button>

                    {startPage > 2 && (
                        <span className="pagination-ellipsis">
                            …
                        </span>
                    )}
                </>
            )}

            {pageNumbers.map((page) => (
                <button
                    type="button"
                    key={page}
                    onClick={() => changePage(page)}
                    className={
                        page === currentPage ? 'active' : ''
                    }
                    aria-label={`Go to page ${page}`}
                    aria-current={
                        page === currentPage ? 'page' : undefined
                    }
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="pagination-ellipsis">
                            …
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => changePage(totalPages)}
                        aria-label={`Go to page ${totalPages}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
            >
                Next →
            </button>
        </nav>
    );
}

export default Pagination;