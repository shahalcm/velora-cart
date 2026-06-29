import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const userTokenStr = localStorage.getItem('user_token');
  if (userTokenStr) {
    try {
      const userToken = JSON.parse(userTokenStr);
      if (userToken?.token) {
        config.headers.Authorization = `Bearer ${userToken.token}`;
      }
    } catch (e) {
      console.error('Error parsing token from local storage', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
