"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { getAuth } from "firebase/auth";

export default function DebugToken() {
  const { user } = useAuth();
  const [token, setToken] = useState<string>("");
  const auth = getAuth();

  const getToken = async () => {
    try {
      if (auth.currentUser) {
        const newToken = await auth.currentUser.getIdToken(true);
        setToken(newToken);
        console.log("Token:", newToken); // Also log to console for easy copy
      } else {
        setToken("No user is signed in. Please sign in first.");
      }
    } catch (error) {
      console.error("Error getting token:", error);
      setToken("Error getting token. See console for details.");
    }
  };

  return (
    <div className='fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg z-50'>
      <button
        onClick={getToken}
        className='bg-blue-500 text-white px-4 py-2 rounded mb-2'
      >
        Get Token
      </button>
      {token && (
        <div className='mt-2'>
          <p className='text-sm font-bold'>Token:</p>
          <textarea
            value={token}
            readOnly
            className='w-64 h-20 text-xs p-2 border rounded'
            onClick={(e) => {
              const textarea = e.target as HTMLTextAreaElement;
              textarea.select();
              document.execCommand("copy");
            }}
          />
          <p className='text-xs text-gray-500 mt-1'>Click to copy</p>
        </div>
      )}
    </div>
  );
}
