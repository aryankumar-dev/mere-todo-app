import axios from 'axios';

// ✅ Base Axios instance with credentials enabled
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// ==================== Auth APIs  ====================

// Register user
export const registerUser = async (data) => {
    const res = await API.post('/auth/register', data, { withCredentials: true });
    return res.data;
};

// Login user
export const loginUser = async (data) => {
    const res = await API.post('/auth/login', data, { withCredentials: true });
    return res.data;
};

// Refresh token
export const refreshToken = async () => {
    const res = await API.get('/auth/refresh', { withCredentials: true });
    return res.data;
};

// Logout user
export const logoutUser = async () => {
    const res = await API.post('/auth/logout', {}, { withCredentials: true });
    return res.data;
};

// Check Authentication
const res = await API.get('/auth/check', {
    withCredentials: true,
    headers: {
        'Cache-Control': 'no-store'
    }
});


// ==================== Task APIs ====================

// Get tasks
export const getTasks = async () => {
    const res = await API.get('/task/', { withCredentials: true });
    return res.data;
};

// Create task
export const createTask = async (data) => {
    const res = await API.post('/task/', data, { withCredentials: true });
    return res.data;
};

// Update task
export const updateTask = async (id, data) => {
    const res = await API.put(`/task/${id}`, data, { withCredentials: true });
    return res.data;
};

// Delete task
export const deleteTask = async (id) => {
    const res = await API.delete(`/task/${id}`, { withCredentials: true });
    return res.data;
};
