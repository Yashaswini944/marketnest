import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import { productService } from './productService';

describe('productService', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('fetches all products successfully', async () => {
        const products = [
            {
                id: 1,
                title: 'Test Product',
                price: 25,
            },
            {
                id: 2,
                title: 'Second Product',
                price: 40,
            },
        ];

        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(products),
        });

        const result = await productService.getAllProducts();

        expect(fetch).toHaveBeenCalledWith(
            'https://fakestoreapi.com/products'
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual(products);
    });

    it('throws an error when loading all products fails', async () => {
        fetch.mockResolvedValue({
            ok: false,
        });

        await expect(
            productService.getAllProducts()
        ).rejects.toThrow(
            'Unable to load products. Please try again.'
        );

        expect(fetch).toHaveBeenCalledWith(
            'https://fakestoreapi.com/products'
        );
    });

    it('fetches a product by id successfully', async () => {
        const product = {
            id: 5,
            title: 'Test Laptop',
            price: 999.99,
        };

        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(product),
        });

        const result = await productService.getProductById(5);

        expect(fetch).toHaveBeenCalledWith(
            'https://fakestoreapi.com/products/5'
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual(product);
    });

    it('throws an error when loading a product by id fails', async () => {
        fetch.mockResolvedValue({
            ok: false,
        });

        await expect(
            productService.getProductById(999)
        ).rejects.toThrow(
            'Unable to load this product.'
        );

        expect(fetch).toHaveBeenCalledWith(
            'https://fakestoreapi.com/products/999'
        );
    });

    it('fetches product categories successfully', async () => {
        const categories = [
            'electronics',
            'jewelery',
            "men's clothing",
            "women's clothing",
        ];

        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(categories),
        });

        const result = await productService.getCategories();

        expect(fetch).toHaveBeenCalledWith(
            'https://fakestoreapi.com/products/categories'
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual(categories);
    });

    it('throws an error when loading product categories fails', async () => {
        fetch.mockResolvedValue({
            ok: false,
        });

        await expect(
            productService.getCategories()
        ).rejects.toThrow(
            'Unable to load product categories.'
        );

        expect(fetch).toHaveBeenCalledWith(
            'https://fakestoreapi.com/products/categories'
        );
    });
});