import axios from 'axios';

const API = axios.create({
    baseURL: "https://mere-todo-app.onrender.com/api",
    withCredentials: true,
});

// ==================== Auth APIs  ====================

// Register user
export const registerUser = async (data) => {
    const res = await API.post('/auth/register', data);
    return res.data;
};

// Login user
export const loginUser = async (data) => {
    const res = await API.post('/auth/login', data);
    return res.data;
};

// Refresh token
export const refreshToken = async () => {
    const res = await API.get('/auth/refresh');
    return res.data;
};

// Logout user
export const logoutUser = async () => {
    const res = await API.post('/auth/logout');
    return res.data;
};

// ==================== Task APIs ====================

// Get tasks
export const getTasks = async () => {
    const res = await API.get('/task/');
    return res.data;
};

// Create task
export const createTask = async (data) => {
    const res = await API.post('/task/', data);
    return res.data;
};

// Update task
export const updateTask = async (id, data) => {
    const res = await API.put(`/task/${id}`, data);
    return res.data;
};

// Delete task
export const deleteTask = async (id) => {
    const res = await API.delete(`/task/${id}`);
    return res.data;
};

// Check Authentication
export const checkAuth = async () => {
    const res = await API.get('/auth/check');
    return res.data;
};
