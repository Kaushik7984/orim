"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authAPI, usersAPI } from "@/utils/api";
import { auth, signInWithGoogle } from "@/utils/firebase";
import { User as FirebaseUser } from "firebase/auth";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  loginWithGoogle: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the ID token
          const token = await firebaseUser.getIdToken();
          
          // Verify token with backend
          const response = await authAPI.verifyToken(token);
          setUser(response.user);
          localStorage.setItem('token', token);
        } catch (err) {
          console.error('Error verifying token:', err);
          setError('Authentication failed');
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Google
      const firebaseUser = await signInWithGoogle();
      
      // Get the ID token
      const token = await firebaseUser.getIdToken();
      
      // Verify token with backend
      const response = await authAPI.verifyToken(token);
      setUser(response.user);
      localStorage.setItem('token', token);
    } catch (err) {
      console.error('Error during Google sign in:', err);
      setError('Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 