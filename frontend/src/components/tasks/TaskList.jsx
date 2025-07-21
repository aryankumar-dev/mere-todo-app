
import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask } from '../../services/api-client.service';
import {
  List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, Chip, Stack, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import EditTaskModal from './EditTaskModal';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.tasks);
  };

  useEffect(() => {
    fetchTasks();
    window.addEventListener('task-updated', fetchTasks);
    return () => window.removeEventListener('task-updated', fetchTasks);
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if (confirm.isConfirmed) {
      await deleteTask(id);
      fetchTasks();
       window.dispatchEvent(new Event('task-updated')); 
      Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
    }
  };

  const toggleComplete = async (task) => {
    await updateTask(task._id, { completed: !task.completed });
    fetchTasks();
    window.dispatchEvent(new Event('task-updated')); 
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setEditOpen(true);
  };

  const handleUpdateTask = async (newTitle) => {
    await updateTask(editTask._id, { title: newTitle });
    fetchTasks();
  };

  return (
    <>
      <List sx={{ mt: 2 }}>
        {tasks.map((task) => (
          <ListItem key={task._id} sx={{ mb: 1, borderRadius: 2, boxShadow: 1, backgroundColor: task.completed ? '#e6ffed' : '#f5f5f5' }}>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center">
                  {task.title}
                  {task.completed && <Chip label="Done" size="small" color="success" sx={{ ml: 2 }} />}
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Stack direction="row" spacing={1}>
                <IconButton color={task.completed ? 'warning' : 'success'} onClick={() => toggleComplete(task)}>
                  {task.completed ? <UndoIcon /> : <CheckCircleIcon />}
                </IconButton>
                <IconButton color="primary" onClick={() => handleEdit(task)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task._id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {editTask && (
        <EditTaskModal
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          handleUpdate={handleUpdateTask}
          initialTitle={editTask.title}
        />
      )}
    </>
  );
};

export default TaskList;
