// frontend/src/api.js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });

  // --- THIS IS THE MODIFIED LOGIC ---
  // Force logout ONLY on 401 (Unauthorized - bad/expired token)
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  // For other errors (like 403 Forbidden), let the component handle it
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
};