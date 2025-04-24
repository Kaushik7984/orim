import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ensureValidToken } from "@/lib/auth-utils";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface InviteDialogProps {
  boardId: string;
  onClose: () => void;
  isOpen: boolean;
}

export default function InviteDialog({
  boardId,
  onClose,
  isOpen,
}: InviteDialogProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog is opened/closed
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setMessage("");
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      toast.error("You must be logged in to send invitations");
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate boardId
    if (!boardId || boardId.trim() === "") {
      setError("Board ID is required");
      return;
    }

    try {
      setIsLoading(true);

      // Ensure we have a valid token before making the request
      const hasValidToken = await ensureValidToken();
      if (!hasValidToken) {
        toast.error("Authentication error. Please try logging in again.");
        return;
      }

      // Prepare invitation data
      const invitationData = {
        email,
        boardId,
        message: message || undefined,
      };

      await api.post("/invitations", invitationData);
      console.log("helo api", { api });

      toast.success("Invitation sent successfully!");
      onClose();
    } catch (error: any) {
      // Handle error response
      if (error.response?.data) {
        setError(error.response.data.message || "Failed to send invitation");
      } else {
        setError("Failed to send invitation. Please try again.");
      }
      toast.error(
        error.response?.data?.message ||
          "Failed to send invitation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If dialog is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-xl font-semibold mb-4'>Invite to Board</h2>
        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md'>
            {error}
          </div>
        )}
        <form onSubmit={handleInvite}>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='message'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Message (Optional)
            </label>
            <textarea
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={3}
            />
          </div>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
