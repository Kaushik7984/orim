"use client";
import { Typography } from "@mui/material";
import Image from "next/image";
import BoardCard from "../Board/BoardCard";
import { Board } from "@/types";

const getPlaceholderById = (id: string) => {
  const hash = Array.from(id).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const index = (hash % 10) + 1;
  return `/placeholders/${index}.svg`;
};

interface BoardListProps {
  boards: Board[];
  onOpen: (boardId: string) => void;
  onDelete: (boardId: string) => void;
  onRename: (boardId: string, currentTitle: string) => void;
  onStar: (boardId: string) => void;
  onManageCollaborators: (boardId: string, collaborators: string[]) => void;
}

const BoardList = ({
  boards,
  onOpen,
  onDelete,
  onRename,
  onStar,
  onManageCollaborators,
}: BoardListProps) => {
  if (!boards || boards.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center text-center py-8 sm:py-12'>
        <Image
          src='/elements.svg'
          alt='No boards'
          width={400}
          height={300}
          priority
        />
        <Typography variant='h6' color='textSecondary' className='mt-4'>
          No boards yet. Create your first board to get started!
        </Typography>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4'>
      {boards.map((board) => (
        <div key={board._id} className='flex justify-center'>
          <BoardCard
            title={board.title || "Untitled"}
            ownerEmail={board.ownerEmail}
            createdAt={board.createdAt}
            onClick={() => onOpen(board._id)}
            onDelete={() => onDelete(board._id)}
            onEdit={() => onRename(board._id, board.title)}
            onStar={() => onStar(board._id)}
            onManageCollaborators={() =>
              onManageCollaborators(board._id, board.collaborators || [])
            }
            isStarred={board.isStarred}
            backgroundImage={getPlaceholderById(board._id)}
            ownerId={board.ownerId}
            collaborators={board.collaborators}
            boardId={board._id}
          />
        </div>
      ))}
    </div>
  );
};

export default BoardList;
