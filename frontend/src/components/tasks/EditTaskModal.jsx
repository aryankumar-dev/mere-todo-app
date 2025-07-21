import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';

const EditTaskModal = ({ open, handleClose, handleUpdate, initialTitle }) => {
  const [title, setTitle] = useState(initialTitle);

  // Ensure when opening modal, input is set properly
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSubmit = () => {
    if (title.trim() !== '') {
      handleUpdate(title);
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          minWidth: 400,
          background: 'linear-gradient(to right, #e0f7fa, #f1f8e9)',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 'bold' }}>
        ✏️ Edit Task
      </DialogTitle>

      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Update your task title:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Task Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
