import React, { useState } from 'react';
import { createTask } from '../../services/api-client.service';
import { TextField, Button, Alert, Stack } from '@mui/material';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createTask({ title });
      setTitle('');
      window.dispatchEvent(new Event('task-updated'));
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          variant="outlined"
          label="Enter a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Task
        </Button>
      </Stack>
    </form>
  );
};

export default TaskForm;
