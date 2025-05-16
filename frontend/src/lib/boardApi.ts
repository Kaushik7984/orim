import { Board } from "@/types";
import axios from "axios";
import { getAuth } from "firebase/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Function to wait for user authentication state change
const waitForUser = (): Promise<any> => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      user ? resolve(user) : reject(new Error("User not authenticated"));
    });
  });
};

// Fetch the authentication headers with Firebase token
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
    try {
      const config = await getAuthHeaders();
      const response = await axios.get<Board[]>(`${BASE_URL}/boards`, config);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch all boards", error);
      throw error;
    }
  },

  getStarredBoards: async (): Promise<Board[]> => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.get<Board[]>(
        `${BASE_URL}/boards/starred`,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch starred boards", error);
      throw error;
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
      console.error(`Failed to fetch board with ID ${id}`, error);
      throw error;
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
      console.error("Failed to create board", error);
      throw error;
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
      // console.log(`Board ${id} updated successfully`);
      return response.data;
    } catch (error) {
      console.error(`Failed to update board with ID ${id}`, error);
      throw error;
    }
  },

  toggleStarBoard: async (id: string): Promise<Board> => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.patch<Board>(
        `${BASE_URL}/boards/${id}/star`,
        {},
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to toggle star for board with ID ${id}`, error);
      throw error;
    }
  },

  deleteBoard: async (id: string): Promise<void> => {
    try {
      const config = await getAuthHeaders();
      await axios.delete(`${BASE_URL}/boards/${id}`, config);
    } catch (error) {
      console.error(`Failed to delete board with ID ${id}`, error);
      throw error;
    }
  },

  sendBoardInvite: async ({
    email,
    boardId,
    message,
  }: {
    email: string;
    boardId: string;
    message?: string;
  }): Promise<void> => {
    try {
      const config = await getAuthHeaders();
      await axios.post(
        `${BASE_URL}/mail/invite`,
        { email, boardId, message },
        config
      );
    } catch (error) {
      console.error("Failed to send invitation", error);
      throw error;
    }
  },

  addCollaborator: async (
    boardId: string,
    collaboratorEmail: string
  ): Promise<Board> => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.patch<Board>(
        `${BASE_URL}/boards/${boardId}/collaborator/${collaboratorEmail}`,
        {},
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to add collaborator to board ${boardId}`, error);
      throw error;
    }
  },

  removeCollaborator: async (
    boardId: string,
    collaboratorEmail: string
  ): Promise<Board> => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.delete<Board>(
        `${BASE_URL}/boards/${boardId}/collaborator/${collaboratorEmail}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to remove collaborator from board ${boardId}`,
        error
      );
      throw error;
    }
  },
};
