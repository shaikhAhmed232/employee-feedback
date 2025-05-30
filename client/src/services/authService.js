import api from './api';

const ENDPOINT = '/auth';

// User login
export const login = async (credentials) => {
  const response = await api.post(`${ENDPOINT}/login`, credentials);
  // Store token in localStorage
  if (response.data.data?.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

// User registration
export const register = async (userData) => {
  const response = await api.post(`${ENDPOINT}/register`, userData);
  // Store token in localStorage
  if (response.data.data?.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

// Create admin user (admin only)
export const createAdmin = async (userData) => {
  const response = await api.post(`${ENDPOINT}/admin`, userData);
  return response.data;
};

// Get user profile
export const getProfile = async () => {
  const response = await api.get(`${ENDPOINT}/profile`);
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Check if user is admin
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
};

// Get current user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || '{}');
};