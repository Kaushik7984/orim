import { auth } from "@/config/firebase";

// Function to refresh the token
export const refreshToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true); // Force refresh
      localStorage.setItem("token", token);
      console.log("Token refreshed and saved to localStorage");
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Set up periodic token refresh (every 30 minutes)
export const setupTokenRefresh = () => {
  // Refresh token immediately
  refreshToken();

  // Set up interval to refresh token every 30 minutes
  const intervalId = setInterval(refreshToken, 30 * 60 * 1000);

  // Return cleanup function
  return () => clearInterval(intervalId);
};
