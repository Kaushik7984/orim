"use client";
import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import BoardCard from "../Board/BoardCard";

const getPlaceholderById = (id: string) => {
  const hash = Array.from(id).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const index = (hash % 10) + 1;
  return `/placeholders/${index}.svg`;
};

const BoardList = ({ boards, onOpen, onDelete, onRename, onStar }: any) => {
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
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {boards.map((board: any) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2.4}
          key={board._id}
          sx={{
            display: "flex",
            maxWidth: { lg: "20%", xl: "20%" },
            flexBasis: { lg: "20%", xl: "20%" },
          }}
        >
          <BoardCard
            title={board.title || "Untitled"}
            ownerEmail={board.ownerEmail}
            createdAt={board.createdAt}
            onClick={() => onOpen(board._id)}
            onDelete={() => onDelete(board._id)}
            onEdit={() => onRename(board._id, board.title)}
            onStar={() => onStar(board._id)}
            isStarred={board.isStarred}
            backgroundImage={getPlaceholderById(board._id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default BoardList;
