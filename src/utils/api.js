import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://communicable-diseases-backend-m8xl.onrender.com/',
  baseURL: 'https://communicable-diseases-backend.onrender.com/',
  // baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request failed:', error.message);
    return Promise.reject(error);
  }
);

export default api;