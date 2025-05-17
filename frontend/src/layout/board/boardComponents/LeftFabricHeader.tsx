import { useBoard } from "@/context/BoardContext/useBoard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { Crown, Upload } from "lucide-react";
import { Fira_Sans } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fira_sans = Fira_Sans({
  subsets: ["latin"],
  weight: ["500"],
});

const LeftFabricHeader = () => {
  const { boardName, boardId, updateBoard, deleteBoard, loadBoard } =
    useBoard();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [newBoardName, setNewBoardName] = useState(boardName || "Untitled");
  const [loading, setLoading] = useState(false);
  const [localBoardName, setLocalBoardName] = useState(boardName || "Untitled");

  useEffect(() => {
    setLocalBoardName(boardName || "Untitled");
  }, [boardName]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRenameClick = () => {
    handleMenuClose();
    setNewBoardName(localBoardName);
    setOpenRenameDialog(true);
  };

  const handleRenameDialogClose = () => {
    setOpenRenameDialog(false);
  };

  const handleRenameSubmit = async () => {
    if (!boardId || !newBoardName.trim() || loading) return;

    setLoading(true);
    try {
      await updateBoard(boardId, { title: newBoardName.trim() });

      setLocalBoardName(newBoardName.trim());
      setOpenRenameDialog(false);

      setTimeout(() => {
        if (boardId) {
          loadBoard(boardId);
        }
      }, 100);
    } catch (err) {
      console.error("Failed to rename board:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!boardId || loading) return;

    if (
      window.confirm(
        "Are you sure you want to delete this board? This action cannot be undone."
      )
    ) {
      setLoading(true);
      try {
        await deleteBoard(boardId);
        router.push("/dashboard");
      } catch (err) {
        console.error("Failed to delete board:", err);
      } finally {
        setLoading(false);
      }
    }
    handleMenuClose();
  };

  const handleDuplicateBoard = () => {
    alert("Duplicate board functionality will be added soon");
    handleMenuClose();
  };

  const handleExportBoard = () => {
    alert("Export board functionality will be added soon");
    handleMenuClose();
  };

  return (
    <div
      className='flex flex-row rounded-md gap-3 bg-white border border-gray-200 pl-2 items-center ml-1 mt-1'
      style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      onClick={() => router.push("/dashboard")}
    >
      <Image
        src='/orime.svg'
        alt='Orime Logo'
        width={100}
        height={32}
        className='cursor-pointer hover:opacity-90 transition-opacity'
      />

      <p className='rounded-md  hover:bg-[#dde4fc] duration-200 cursor-pointer text-sm pl-2'>
        {localBoardName}
      </p>
      <span
        className='p-2 rounded-md hover:bg-[#dde4fc] duration-200 cursor-pointer'
        onClick={handleMenuClick}
      >
        <MoreVertIcon />
      </span>
      <span className='p-2 rounded-md hover:bg-[#dde4fc] duration-200 cursor-pointer'>
        <Tooltip title='Export Board'>
          <Upload />
        </Tooltip>
      </span>
      <span className='p-2 rounded-md hover:bg-[#dde4fc] duration-200 cursor-pointer'>
        <Tooltip title='Get Premium'>
          <Crown color='#D4AF37' />
        </Tooltip>
      </span>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            minWidth: 180,
            mt: 0.5,
          },
        }}
      >
        <MenuItem onClick={handleRenameClick} sx={{ gap: 1.5 }}>
          <DriveFileRenameOutlineIcon fontSize='small' />
          Rename
        </MenuItem>
        <MenuItem onClick={handleDuplicateBoard} sx={{ gap: 1.5 }}>
          <ContentCopyIcon fontSize='small' />
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleExportBoard} sx={{ gap: 1.5 }}>
          <DownloadIcon fontSize='small' />
          Export
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDeleteBoard}
          sx={{ color: "error.main", gap: 1.5 }}
        >
          <DeleteOutlineIcon fontSize='small' />
          Delete
        </MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog open={openRenameDialog} onClose={handleRenameDialogClose}>
        <DialogTitle>Rename Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Board Name'
            type='text'
            fullWidth
            variant='outlined'
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameDialogClose}>Cancel</Button>
          <Button
            onClick={handleRenameSubmit}
            disabled={!newBoardName.trim() || loading}
            variant='contained'
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeftFabricHeader;
