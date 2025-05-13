"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBoard } from "@/context/BoardContext/useBoard";
import { CircularProgress, Typography } from "@mui/material";
import DashboardSubHeader from "@/components/dashboard/DashboardSubHeader";
import CreateBoardDialog from "@/components/dashboard/CreateBoardDialog";
import RenameBoardDialog from "@/components/dashboard/RenameBoardDialog";
import BoardList from "@/components/dashboard/BoardList";

const Dashboard = () => {
  const {
    boards,
    loading,
    error,
    createBoard,
    loadBoards,
    deleteBoard,
    updateBoard,
    toggleStarBoard,
  } = useBoard();
  const router = useRouter();

  const [creating, setCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  useEffect(() => {
    loadBoards();
  }, []);

  const handleCreateBoard = async () => {
    if (!boardTitle.trim() || creating) return;

    setCreating(true);
    try {
      const newBoard = await createBoard(boardTitle.trim());
      setOpenDialog(false);
      setBoardTitle("");
      router.push(`/board/${newBoard._id}`);
    } catch (err) {
      console.error("Failed to create board:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenBoard = (boardId: string) => router.push(`/board/${boardId}`);

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      loadBoards();
    } catch (err) {
      console.error("Failed to delete board:", err);
    }
  };

  const handleRenameBoard = (boardId: string, currentTitle: string) => {
    setRenameTitle(currentTitle);
    setSelectedBoardId(boardId);
    setRenameDialogOpen(true);
  };

  const handleStarBoard = async (boardId: string) => {
    try {
      await toggleStarBoard(boardId);
      loadBoards();
    } catch (err) {
      console.error("Failed to toggle star:", err);
    }
  };

  const confirmRename = async () => {
    if (!selectedBoardId || !renameTitle.trim()) return;

    try {
      await updateBoard(selectedBoardId, { title: renameTitle.trim() });
      setRenameDialogOpen(false);
      await loadBoards();
    } catch (err) {
      console.error("Failed to rename board:", err);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen text-red-500'>
        <Typography variant='h6'>{error}</Typography>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 sm:px-6 py-6 sm:py-10'>
      <DashboardSubHeader onCreateClick={() => setOpenDialog(true)} />
      <BoardList
        boards={boards}
        onOpen={handleOpenBoard}
        onDelete={handleDeleteBoard}
        onRename={handleRenameBoard}
        onStar={handleStarBoard}
      />
      <CreateBoardDialog
        open={openDialog}
        creating={creating}
        boardTitle={boardTitle}
        onChange={setBoardTitle}
        onClose={() => setOpenDialog(false)}
        onCreate={handleCreateBoard}
      />
      <RenameBoardDialog
        open={renameDialogOpen}
        title={renameTitle}
        onChange={setRenameTitle}
        onClose={() => setRenameDialogOpen(false)}
        onConfirm={confirmRename}
      />
    </div>
  );
};

export default Dashboard;
