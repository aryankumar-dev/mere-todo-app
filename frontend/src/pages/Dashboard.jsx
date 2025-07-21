import React, { useEffect, useState, useCallback } from 'react';
import AppNavbar from '../components/Navbar';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import { Container, Card, Typography, Box, Grid } from '@mui/material';
import { getTasks } from '../services/api-client.service';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    const res = await getTasks();
    setTasks(res.tasks);
  }, []);

  useEffect(() => {
    fetchTasks();
    window.addEventListener('task-updated', fetchTasks);
    return () => window.removeEventListener('task-updated', fetchTasks);
  }, [fetchTasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to right, #4facfe, #00f2fe)', pb: 4 }}>
      <AppNavbar />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Card elevation={5} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom color="primary">
            📋 Today's To-Do List
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
            For {formattedDate}
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 2, mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#f0f0f0' }}>
                <Typography variant="h6">Total Tasks</Typography>
                <Typography variant="h5" color="primary">{totalTasks}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#e6ffed' }}>
                <Typography variant="h6">Completed</Typography>
                <Typography variant="h5" color="success.main">{completedTasks}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff5f5' }}>
                <Typography variant="h6">Pending</Typography>
                <Typography variant="h5" color="error.main">{pendingTasks}</Typography>
              </Card>
            </Grid>
          </Grid>
          <TaskForm onTaskChange={fetchTasks} />
          <TaskList onTaskChange={fetchTasks} />
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;
