import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Invitation {
  id: string;
  boardId: string;
  message?: string;
  invitedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export function PendingInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/invitations/pending");
      if (!response.ok) {
        throw new Error("Failed to fetch invitations");
      }
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast.error("Failed to load invitations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/accept`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to accept invitation");
      }

      toast.success("Invitation accepted");
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    }
  };

  if (isLoading) {
    return <div>Loading invitations...</div>;
  }

  if (invitations.length === 0) {
    return <div>No pending invitations</div>;
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Pending Invitations</h2>
      {invitations.map((invitation) => (
        <Card key={invitation.id}>
          <CardHeader>
            <CardTitle>Board Invitation</CardTitle>
            <CardDescription>
              From {invitation.invitedBy.name} ({invitation.invitedBy.email})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitation.message && (
              <p className='text-sm text-gray-500'>{invitation.message}</p>
            )}
            <p className='text-sm text-gray-500'>
              Sent on {new Date(invitation.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              onClick={() =>
                setInvitations((prev) =>
                  prev.filter((inv) => inv.id !== invitation.id)
                )
              }
            >
              Decline
            </Button>
            <Button onClick={() => handleAcceptInvitation(invitation.id)}>
              Accept
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
