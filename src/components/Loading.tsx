import { CircularProgress } from "@mui/material";

export function Loading() {
  return (
    <div className='h-full w-full flex items-center justify-center'>
      <CircularProgress />
    </div>
  );
}
