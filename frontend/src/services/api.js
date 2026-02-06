import axios from 'axios';

const api = axios.create({
  baseURL: 'https://medianv-database-management-interface.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    // 'x-api-key': import.meta.env.VITE_API_KEY
  }
});

export default api;