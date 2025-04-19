"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { refreshToken } from "@/lib/token-refresh";

interface AuthCheckProps {
  children: React.ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
  const { user, loading } = useAuth();
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkToken = async () => {
      if (user) {
        try {
          // Try to refresh the token
          const token = await refreshToken();
          setTokenValid(!!token);
        } catch (error) {
          console.error("Error checking token:", error);
          setTokenValid(false);
        }
      } else {
        setTokenValid(false);
      }
      setChecking(false);
    };

    checkToken();
  }, [user]);

  if (loading || checking) {
    return <div>Loading...</div>;
  }

  if (!user || !tokenValid) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-4'>
        <h1 className='text-2xl font-bold mb-4'>Authentication Required</h1>
        <p className='mb-4'>Please sign in to access this page.</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Sign In
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
