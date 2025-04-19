// boardApi.ts
import axios from "axios";
import { getAuth } from "firebase/auth";
import { Board } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const getAuthHeaders = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const boardAPI = {
  getAllBoards: async () => {
    const config = await getAuthHeaders();
    return axios.get<Board[]>(`${BASE_URL}/boards`, config);
  },

  getBoard: async (id: string) => {
    const config = await getAuthHeaders();
    return axios.get<Board>(`${BASE_URL}/boards/${id}`, config);
  },

  createBoard: async (data: Partial<Board>) => {
    const config = await getAuthHeaders();
    return axios.post<Board>(`${BASE_URL}/boards`, data, config);
  },

  updateBoard: async (id: string, data: Partial<Board>) => {
    const config = await getAuthHeaders();
    return axios.patch<Board>(`${BASE_URL}/boards/${id}`, data, config);
  },

  deleteBoard: async (id: string) => {
    const config = await getAuthHeaders();
    return axios.delete(`${BASE_URL}/boards/${id}`, config);
  },

  updateCanvas: async (id: string, canvasData: any) => {
    const config = await getAuthHeaders();
    return axios.patch(
      `${BASE_URL}/boards/${id}/canvas`,
      { canvasData },
      config
    );
  },
};
