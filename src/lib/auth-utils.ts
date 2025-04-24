import { auth } from "@/config/firebase";

/**
 * Ensures the user has a valid token in localStorage
 * @returns Promise<boolean> - Whether the token is valid
 */
export const ensureValidToken = async (): Promise<boolean> => {
  try {
    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
      console.log("No user is logged in");
      return false;
    }

    // Get a fresh token
    const token = await user.getIdToken(true);

    // Save to localStorage
    localStorage.setItem("token", token);
    // console.log("Token refreshed and saved to localStorage");

    return true;
  } catch (error) {
    console.error("Error ensuring valid token:", error);
    return false;
  }
};

/**
 * Gets the current token from localStorage or refreshes it if needed
 * @returns Promise<string | null> - The token or null if not available
 */
export const getValidToken = async (): Promise<string | null> => {
  try {
    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
      console.log("No user is logged in");
      return null;
    }

    // Get a fresh token
    const token = await user.getIdToken(true);

    // Save to localStorage
    localStorage.setItem("token", token);
    // console.log("Token refreshed and saved to localStorage");

    return token;
  } catch (error) {
    console.error("Error getting valid token:", error);
    return null;
  }
};
