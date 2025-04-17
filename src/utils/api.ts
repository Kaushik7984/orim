import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  verifyToken: async (token: string) => {
    const response = await api.post('/auth/verify', { token });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  createUser: async (userData: {
    firebaseUid: string;
    email: string;
    name: string;
    avatar?: string;
    isAdmin?: boolean;
  }) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },
};

// Drawings API
export const drawingsAPI = {
  createDrawing: async (drawingData: {
    title: string;
    description: string;
    imageUrl: string;
    isPublic: boolean;
  }) => {
    const response = await api.post('/drawings', drawingData);
    return response.data;
  },

  getDrawings: async () => {
    const response = await api.get('/drawings');
    return response.data;
  },

  getDrawing: async (id: string) => {
    const response = await api.get(`/drawings/${id}`);
    return response.data;
  },

  updateDrawing: async (id: string, drawingData: any) => {
    const response = await api.patch(`/drawings/${id}`, drawingData);
    return response.data;
  },

  deleteDrawing: async (id: string) => {
    const response = await api.delete(`/drawings/${id}`);
    return response.data;
  },

  likeDrawing: async (id: string) => {
    const response = await api.post(`/drawings/${id}/like`);
    return response.data;
  },

  unlikeDrawing: async (id: string) => {
    const response = await api.post(`/drawings/${id}/unlike`);
    return response.data;
  },

  addCollaborator: async (id: string, userId: string) => {
    const response = await api.post(`/drawings/${id}/collaborators`, { userId });
    return response.data;
  },

  removeCollaborator: async (id: string, userId: string) => {
    const response = await api.delete(`/drawings/${id}/collaborators/${userId}`);
    return response.data;
  },
}; 