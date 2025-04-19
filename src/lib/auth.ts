import { useState, useEffect } from "react";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage on mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return {
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };
};
