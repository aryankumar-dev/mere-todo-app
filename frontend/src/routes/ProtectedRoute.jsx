import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuth } from '../services/api-client.service.js'; // Adjust path according to your structure

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const res = await checkAuth();
                setIsAuthenticated(res.success);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        verifyAuth();
    }, []);

    if (isAuthenticated === null) return <p>Loading...</p>;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
