import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
};

export const drawingsAPI = {
  createDrawing: (data: {
    title: string;
    description: string;
    imageUrl: string;
    isPublic: boolean;
  }) => api.post('/drawings', data),
  getDrawing: (id: string) => api.get(`/drawings/${id}`),
  updateDrawing: (id: string, data: { imageUrl: string }) =>
    api.patch(`/drawings/${id}`, data),
  deleteDrawing: (id: string) => api.delete(`/drawings/${id}`),
  getUserDrawings: () => api.get('/drawings/user'),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { name?: string; email?: string }) =>
    api.patch('/users/profile', data),
};

export default api; 