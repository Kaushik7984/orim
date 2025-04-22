import axios from "axios";
import { getAuth } from "firebase/auth";
import { Board } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const waitForUser = (): Promise<any> => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      user ? resolve(user) : reject(new Error("User not authenticated"));
    });
  });
};

const getAuthHeaders = async () => {
  const auth = getAuth();
  const user = auth.currentUser || (await waitForUser());
  const token = await user.getIdToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const boardAPI = {
  getAllBoards: async (): Promise<Board[]> => {
    const config = await getAuthHeaders();
    const response = await axios.get<Board[]>(`${BASE_URL}/boards`, config);
    return response.data;
  },

  getBoard: async (id: string): Promise<Board> => {
    const config = await getAuthHeaders();
    const response = await axios.get<Board>(`${BASE_URL}/boards/${id}`, config);
    return response.data;
  },

  createBoard: async (data: Partial<Board>): Promise<Board> => {
    const config = await getAuthHeaders();
    const response = await axios.post<Board>(
      `${BASE_URL}/boards`,
      data,
      config
    );
    return response.data;
  },

  updateBoard: async (id: string, data: Partial<Board>): Promise<Board> => {
    const config = await getAuthHeaders();
    const response = await axios.patch<Board>(
      `${BASE_URL}/boards/${id}`,
      data,
      config
    );
    // console.log(`API: Updated board ${id}`, response.data);
    return response.data;
  },

  deleteBoard: async (id: string): Promise<void> => {
    const config = await getAuthHeaders();
    await axios.delete(`${BASE_URL}/boards/${id}`, config);
  },

  updateCanvas: async (id: string, canvasData: any): Promise<void> => {
    const config = await getAuthHeaders();
    await axios.patch(
      `${BASE_URL}/boards/${id}/canvas`,
      { canvasData },
      config
    );
    console.log(`API: Updated canvas for board ${id}`);
  },
};
