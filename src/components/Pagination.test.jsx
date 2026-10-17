import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    cleanup,
    render,
    screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Pagination from './Pagination';

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

beforeEach(() => {
    window.scrollTo = vi.fn();
});

function renderPagination({
    currentPage = 1,
    totalPages = 10,
    onPageChange = vi.fn(),
} = {}) {
    render(
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );

    return {
        onPageChange,
    };
}

describe('Pagination', () => {
    it('renders nothing when there is only one page', () => {
        const { container } = render(
            <Pagination
                currentPage={1}
                totalPages={1}
                onPageChange={vi.fn()}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when totalPages is zero', () => {
        const { container } = render(
            <Pagination
                currentPage={1}
                totalPages={0}
                onPageChange={vi.fn()}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders pagination navigation when multiple pages exist', () => {
        renderPagination({
            currentPage: 1,
            totalPages: 5,
        });

        expect(
            screen.getByRole('navigation', {
                name: 'Product pagination',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Go to previous page',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Go to next page',
            })
        ).toBeInTheDocument();
    });

    it('disables the previous button on the first page', () => {
        renderPagination({
            currentPage: 1,
            totalPages: 5,
        });

        expect(
            screen.getByRole('button', {
                name: 'Go to previous page',
            })
        ).toBeDisabled();

        expect(
            screen.getByRole('button', {
                name: 'Go to next page',
            })
        ).not.toBeDisabled();
    });

    it('disables the next button on the last page', () => {
        renderPagination({
            currentPage: 5,
            totalPages: 5,
        });

        expect(
            screen.getByRole('button', {
                name: 'Go to next page',
            })
        ).toBeDisabled();

        expect(
            screen.getByRole('button', {
                name: 'Go to previous page',
            })
        ).not.toBeDisabled();
    });

    it('marks the current page as active', () => {
        renderPagination({
            currentPage: 3,
            totalPages: 5,
        });

        const currentPageButton =
            screen.getByRole('button', {
                name: 'Go to page 3',
            });

        expect(currentPageButton).toHaveClass(
            'active'
        );

        expect(currentPageButton).toHaveAttribute(
            'aria-current',
            'page'
        );
    });

    it('changes to the next page', async () => {
        const user = userEvent.setup();

        const onPageChange = vi.fn();

        renderPagination({
            currentPage: 2,
            totalPages: 5,
            onPageChange,
        });

        await user.click(
            screen.getByRole('button', {
                name: 'Go to next page',
            })
        );

        expect(
            onPageChange
        ).toHaveBeenCalledWith(3);

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });

    it('changes to the previous page', async () => {
        const user = userEvent.setup();

        const onPageChange = vi.fn();

        renderPagination({
            currentPage: 3,
            totalPages: 5,
            onPageChange,
        });

        await user.click(
            screen.getByRole('button', {
                name: 'Go to previous page',
            })
        );

        expect(
            onPageChange
        ).toHaveBeenCalledWith(2);

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });

    it('changes directly to a selected page', async () => {
        const user = userEvent.setup();

        const onPageChange = vi.fn();

        renderPagination({
            currentPage: 1,
            totalPages: 5,
            onPageChange,
        });

        await user.click(
            screen.getByRole('button', {
                name: 'Go to page 4',
            })
        );

        expect(
            onPageChange
        ).toHaveBeenCalledWith(4);

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });

    it('does not change page when the current page button is clicked', async () => {
        const user = userEvent.setup();

        const onPageChange = vi.fn();

        renderPagination({
            currentPage: 3,
            totalPages: 5,
            onPageChange,
        });

        await user.click(
            screen.getByRole('button', {
                name: 'Go to page 3',
            })
        );

        expect(
            onPageChange
        ).not.toHaveBeenCalled();

        expect(
            window.scrollTo
        ).not.toHaveBeenCalled();
    });

    it('shows the first page and leading ellipsis when far from the beginning', () => {
        renderPagination({
            currentPage: 6,
            totalPages: 10,
        });

        expect(
            screen.getByRole('button', {
                name: 'Go to page 1',
            })
        ).toBeInTheDocument();

        const ellipses =
            screen.getAllByText('…');

        expect(
            ellipses.length
        ).toBeGreaterThanOrEqual(1);
    });

    it('shows the last page and trailing ellipsis when far from the end', () => {
        renderPagination({
            currentPage: 2,
            totalPages: 10,
        });

        expect(
            screen.getByRole('button', {
                name: 'Go to page 10',
            })
        ).toBeInTheDocument();

        const ellipses =
            screen.getAllByText('…');

        expect(
            ellipses.length
        ).toBeGreaterThanOrEqual(1);
    });

    it('shows both ellipses when the current page is in the middle', () => {
        renderPagination({
            currentPage: 6,
            totalPages: 12,
        });

        const ellipses =
            screen.getAllByText('…');

        expect(ellipses).toHaveLength(2);

        expect(
            screen.getByRole('button', {
                name: 'Go to page 1',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Go to page 12',
            })
        ).toBeInTheDocument();
    });

    it('navigates directly to the first page', async () => {
        const user = userEvent.setup();

        const onPageChange = vi.fn();

        renderPagination({
            currentPage: 7,
            totalPages: 10,
            onPageChange,
        });

        await user.click(
            screen.getByRole('button', {
                name: 'Go to page 1',
            })
        );

        expect(
            onPageChange
        ).toHaveBeenCalledWith(1);

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });

    it('navigates directly to the last page', async () => {
        const user = userEvent.setup();

        const onPageChange = vi.fn();

        renderPagination({
            currentPage: 2,
            totalPages: 10,
            onPageChange,
        });

        await user.click(
            screen.getByRole('button', {
                name: 'Go to page 10',
            })
        );

        expect(
            onPageChange
        ).toHaveBeenCalledWith(10);

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });
});