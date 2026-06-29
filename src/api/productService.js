import apiClient from './apiClient';

export const getProducts = async (limit = 12, offset = 0, title = '') => {
  try {
    let url = `/products?limit=${limit}&offset=${offset}`;
    if (title) {
      url += `&title=${encodeURIComponent(title)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
