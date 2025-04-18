import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
}

export function InviteDialog({ isOpen, onClose, boardId }: InviteDialogProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          boardId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send invitation");
      }

      const data = await response.json();
      console.log("Invitation created:", data);

      toast.success("Invitation sent successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error("Error sending invitation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Invite to Board</DialogTitle>
          <DialogDescription>
            Send an invitation to collaborate on this board.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='email'
              type='email'
              placeholder='Enter email address'
              className='col-span-4'
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Textarea
              id='message'
              placeholder='Add a message (optional)'
              className='col-span-4'
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(e.target.value)
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={!email || isLoading}>
            {isLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
