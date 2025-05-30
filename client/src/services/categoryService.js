import api from './api';

const ENDPOINT = '/category';

// Get all categories
export const getCategories = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

// Create a new category (admin only)
export const createCategory = async (categoryData) => {
  const response = await api.post(ENDPOINT, categoryData);
  return response.data;
};

// Update an existing category (admin only)
export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(`${ENDPOINT}/${categoryId}`, categoryData);
  return response.data;
};

// Delete a category (admin only)
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`${ENDPOINT}/${categoryId}`);
  return response.data;
};