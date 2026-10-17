const API_BASE_URL = 'https://fakestoreapi.com';

const handleResponse = async (response, errorMessage) => {
    if (!response.ok) {
        throw new Error(errorMessage);
    }

    return response.json();
};

export const productService = {
    getAllProducts: async () => {
        const response = await fetch(`${API_BASE_URL}/products`);

        return handleResponse(
            response,
            'Unable to load products. Please try again.'
        );
    },

    getProductById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);

        return handleResponse(
            response,
            'Unable to load this product.'
        );
    },

    getCategories: async () => {
        const response = await fetch(`${API_BASE_URL}/products/categories`);

        return handleResponse(
            response,
            'Unable to load product categories.'
        );
    },
};