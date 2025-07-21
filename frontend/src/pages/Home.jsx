import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';
import { Container, Button, Typography, Box } from '@mui/material';
import useAuthCheck from '../hooks/useAuthCheck';
import '../styles/main.css';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthCheck();

  const handleGetStarted = () => {
    navigate(isLoggedIn ? '/dashboard' : '/login');
  };

  return (
    <Box className="home-bg">
      <AppNavbar />
      <Container className="home-container">
        <Typography variant="h3" color="white" gutterBottom>
          Organize Your Tasks Smarter!
        </Typography>
        <Typography variant="h6" color="white" mb={4}>
          MERN stack ToDo Application for daily productivity
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={handleGetStarted}>
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default Home;
