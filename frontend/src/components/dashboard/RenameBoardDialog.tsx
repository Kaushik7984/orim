"use client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const RenameBoardDialog = ({
  open,
  title,
  onChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Rename Board</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin='dense'
        label='New Board Name'
        type='text'
        fullWidth
        value={title}
        onChange={(e) => onChange(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} disabled={!title.trim()}>
        Rename
      </Button>
    </DialogActions>
  </Dialog>
);

export default RenameBoardDialog;
