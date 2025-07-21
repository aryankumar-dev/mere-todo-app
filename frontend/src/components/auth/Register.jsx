import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api-client.service';
import { TextField, Button, CircularProgress, Box, Typography, Alert, Paper } from '@mui/material';
import '../../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(formData);
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Box className="auth-container">
      <Paper elevation={5} className="auth-card">
        <Typography variant="h4" gutterBottom color="primary">Create Account</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit} className="form-styles">
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth margin="normal" required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth margin="normal" required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth margin="normal" required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth type="submit"
            disabled={loading} sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
