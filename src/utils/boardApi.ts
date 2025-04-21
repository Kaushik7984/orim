// boardApi.ts
import axios from "axios";
import { getAuth } from "firebase/auth";
import { Board } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Optional: Define canvas data structure
type CanvasData = {
  objects: any[]; // Replace 'any' with Fabric.js object typing if needed
  background?: string;
};

// Waits for Firebase auth to load if user is not immediately available
const waitForUser = (): Promise<any> => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) resolve(user);
      else reject(new Error("User not authenticated"));
    });
  });
};

// Gets authorization headers with Firebase ID token
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

// Board API client with error handling
export const boardAPI = {
  getAllBoards: async (): Promise<Board[]> => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.get<Board[]>(`${BASE_URL}/boards`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error("Failed to load boards");
    }
  },

  getBoard: async (id: string): Promise<Board> => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.get<Board>(
        `${BASE_URL}/boards/${id}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching board with ID ${id}:`, error);
      throw new Error("Failed to load board");
    }
  },

  createBoard: async (data: Partial<Board>): Promise<Board> => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.post<Board>(
        `${BASE_URL}/boards`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error creating board:", error);
      throw new Error("Failed to create board");
    }
  },

  updateBoard: async (id: string, data: Partial<Board>): Promise<Board> => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.patch<Board>(
        `${BASE_URL}/boards/${id}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating board with ID ${id}:`, error);
      throw new Error("Failed to update board");
    }
  },

  deleteBoard: async (id: string): Promise<void> => {
    try {
      const config = await getAuthHeaders();
      await axios.delete(`${BASE_URL}/boards/${id}`, config);
    } catch (error) {
      console.error(`Error deleting board with ID ${id}:`, error);
      throw new Error("Failed to delete board");
    }
  },

  updateCanvas: async (id: string, canvasData: CanvasData): Promise<void> => {
    try {
      const config = await getAuthHeaders();
      await axios.patch(
        `${BASE_URL}/boards/${id}/canvas`,
        { canvasData },
        config
      );
    } catch (error) {
      console.error(`Error updating canvas for board ID ${id}:`, error);
      throw new Error("Failed to update canvas");
    }
  },
};
