import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useBoard } from "@/context/BoardContext/useBoard";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@/context/AuthContext";

interface ManageCollaboratorsDialogProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  collaborators: string[];
}

const ManageCollaboratorsDialog = ({
  open,
  onClose,
  boardId,
  collaborators,
}: ManageCollaboratorsDialogProps) => {
  const [newCollaboratorId, setNewCollaboratorId] = useState("");
  const { addCollaborator, removeCollaborator } = useBoard();
  const { user } = useAuth();

  const handleAddCollaborator = async () => {
    if (!newCollaboratorId.trim()) return;
    try {
      await addCollaborator(boardId, newCollaboratorId.trim());
      setNewCollaboratorId("");
    } catch (error) {
      console.error("Failed to add collaborator:", error);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      await removeCollaborator(boardId, collaboratorId);
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Manage Collaborators</DialogTitle>
      <DialogContent>
        <div className='mb-4'>
          <TextField
            fullWidth
            label='Add Collaborator (User ID)'
            value={newCollaboratorId}
            onChange={(e) => setNewCollaboratorId(e.target.value)}
            margin='normal'
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleAddCollaborator}
            disabled={!newCollaboratorId.trim()}
            className='mt-2'
          >
            Add Collaborator
          </Button>
        </div>

        <Typography variant='h6' className='mt-4 mb-2'>
          Current Collaborators
        </Typography>
        <List>
          {collaborators.length === 0 ? (
            <ListItem>
              <ListItemText primary='No collaborators yet' />
            </ListItem>
          ) : (
            collaborators.map((collaboratorId) => (
              <ListItem key={collaboratorId}>
                <ListItemText
                  primary={collaboratorId}
                  secondary={collaboratorId === user?.uid ? "You" : ""}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge='end'
                    aria-label='delete'
                    onClick={() => handleRemoveCollaborator(collaboratorId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageCollaboratorsDialog;
