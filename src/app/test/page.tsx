"use client";

import { useState } from "react";
import { InviteDialog } from "@/components/InviteDialog";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-2xl font-bold mb-4'>Test Page</h1>

      <div className='space-y-4'>
        <div className='p-4 border rounded-lg'>
          <h2 className='text-xl font-semibold mb-2'>Invite Dialog Test</h2>
          <Button onClick={() => setIsDialogOpen(true)}>
            Open Invite Dialog
          </Button>

          <InviteDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            boardId='test-board-123'
          />
        </div>
      </div>
    </div>
  );
}
