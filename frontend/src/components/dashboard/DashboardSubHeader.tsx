"use client";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const DashboardSubHeader = ({
  onCreateClick,
}: {
  onCreateClick: () => void;
}) => (
  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4'>
    <Typography variant='h4' fontWeight={400}>
      Team boards
    </Typography>
    <Button
      variant='contained'
      color='primary'
      startIcon={<AddIcon />}
      onClick={onCreateClick}
      sx={{ borderRadius: "12px", textTransform: "none" }}
    >
      Create Board
    </Button>
  </div>
);

export default DashboardSubHeader;
