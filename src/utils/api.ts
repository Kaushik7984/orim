import axios from "axios";
import { Board, CreateBoardDto } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
    api.post("/auth/login", data),
  register: (data: { email: string; password: string; name: string }) =>
    api.post("/auth/register", data),
};

export const drawingsAPI = {
  createBoard: async (data: CreateBoardDto) => {
    return axios.post<Board>(`${API_URL}/boards`, data);
  },

  getBoard: async (id: string) => {
    return axios.get<Board>(`${API_URL}/boards/${id}`);
  },

  updateBoard: async (id: string, data: Partial<Board>) => {
    return axios.patch<Board>(`${API_URL}/boards/${id}`, data);
  },

  deleteBoard: async (id: string) => {
    return axios.delete(`${API_URL}/boards/${id}`);
  },

  getAllBoards: async () => {
    return axios.get<Board[]>(`${API_URL}/boards`);
  },
};

export const usersAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: { name?: string; email?: string }) =>
    api.patch("/users/profile", data),
};

export default api;
