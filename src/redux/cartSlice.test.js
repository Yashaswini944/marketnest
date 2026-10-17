import { describe, expect, it } from 'vitest';
import reducer, {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} from './cartSlice';

describe('cartSlice', () => {
    const product = {
        id: 1,
        title: 'Test Product',
        price: 25,
    };

    const secondProduct = {
        id: 2,
        title: 'Second Product',
        price: 40,
    };

    it('adds a new product to the cart', () => {
        const state = reducer(undefined, addToCart(product));

        expect(state.items).toHaveLength(1);
        expect(state.items[0]).toEqual({
            ...product,
            quantity: 1,
        });
        expect(state.totalPrice).toBe(25);
    });

    it('increases quantity when the same product is added again', () => {
        let state = reducer(undefined, addToCart(product));

        state = reducer(state, addToCart(product));

        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(2);
        expect(state.totalPrice).toBe(50);
    });

    it('removes a product from the cart', () => {
        let state = reducer(undefined, addToCart(product));

        state = reducer(state, removeFromCart(product.id));

        expect(state.items).toHaveLength(0);
        expect(state.totalPrice).toBe(0);
    });

    it('updates the quantity and recalculates the total price', () => {
        let state = reducer(undefined, addToCart(product));

        state = reducer(
            state,
            updateQuantity({
                id: product.id,
                quantity: 3,
            })
        );

        expect(state.items[0].quantity).toBe(3);
        expect(state.totalPrice).toBe(75);
    });

    it('removes a product when its quantity becomes zero', () => {
        let state = reducer(undefined, addToCart(product));

        state = reducer(
            state,
            updateQuantity({
                id: product.id,
                quantity: 0,
            })
        );

        expect(state.items).toHaveLength(0);
        expect(state.totalPrice).toBe(0);
    });

    it('clears all products from the cart', () => {
        let state = reducer(undefined, addToCart(product));

        state = reducer(state, clearCart());

        expect(state.items).toEqual([]);
        expect(state.totalPrice).toBe(0);
    });

    it('handles multiple different products in the cart', () => {
        let state = reducer(undefined, addToCart(product));

        state = reducer(state, addToCart(secondProduct));

        expect(state.items).toHaveLength(2);
        expect(state.items[0].id).toBe(1);
        expect(state.items[1].id).toBe(2);
        expect(state.totalPrice).toBe(65);
    });

    it('recalculates the total when one of multiple products is removed', () => {
        let state = reducer(undefined, addToCart(product));
        state = reducer(state, addToCart(secondProduct));

        state = reducer(state, removeFromCart(product.id));

        expect(state.items).toHaveLength(1);
        expect(state.items[0].id).toBe(2);
        expect(state.items[0].title).toBe('Second Product');
        expect(state.totalPrice).toBe(40);
    });

    it('leaves the cart unchanged when updating a product that does not exist', () => {
        const state = reducer(
            undefined,
            updateQuantity({
                id: 999,
                quantity: 3,
            })
        );

        expect(state.items).toEqual([]);
        expect(state.totalPrice).toBe(0);
    });

    it('leaves the cart unchanged when removing a product that does not exist', () => {
        const state = reducer(undefined, removeFromCart(999));

        expect(state.items).toEqual([]);
        expect(state.totalPrice).toBe(0);
    });
});