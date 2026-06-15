import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3003/api',
});

// Thêm token vào header nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.role) {
        config.headers['x-user-role'] = user.role;
      }
    }
  } catch (err) {
    console.error('Error parsing user data in interceptor', err);
  }
  
  return config;
});

export default api;
