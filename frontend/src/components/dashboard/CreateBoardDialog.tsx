"use client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const CreateBoardDialog = ({
  open,
  creating,
  boardTitle,
  onChange,
  onClose,
  onCreate,
}: {
  open: boolean;
  creating: boolean;
  boardTitle: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Create New Board</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin='dense'
        label='Board Name'
        type='text'
        fullWidth
        value={boardTitle}
        onChange={(e) => onChange(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onCreate} disabled={creating}>
        {creating ? "Creating..." : "Create"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default CreateBoardDialog;
