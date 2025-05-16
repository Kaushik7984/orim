import { useAuth } from "@/context/AuthContext";
import { useBoard } from "@/context/BoardContext/useBoard";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

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
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const { addCollaborator, removeCollaborator } = useBoard();
  const { user } = useAuth();

  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail.trim()) return;
    try {
      await addCollaborator(boardId, newCollaboratorEmail.trim());
      setNewCollaboratorEmail("");
    } catch (error) {
      console.error("Failed to add collaborator:", error);
    }
  };

  const handleRemoveCollaborator = async (collaboratorEmail: string) => {
    try {
      await removeCollaborator(boardId, collaboratorEmail);
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
            label='Add Collaborator (User Email)'
            value={newCollaboratorEmail}
            onChange={(e) => setNewCollaboratorEmail(e.target.value)}
            margin='normal'
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleAddCollaborator}
            disabled={!newCollaboratorEmail.trim()}
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
            collaborators.map((collaboratorEmail) => (
              <ListItem key={collaboratorEmail}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 2,
                    bgcolor: "secondary.main",
                  }}
                >
                  {collaboratorEmail.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={collaboratorEmail}
                  secondary={collaboratorEmail === user?.uid ? "You" : ""}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge='end'
                    aria-label='delete'
                    onClick={() => handleRemoveCollaborator(collaboratorEmail)}
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
