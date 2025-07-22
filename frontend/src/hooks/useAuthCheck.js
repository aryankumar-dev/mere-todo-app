// src/hooks/useAuthCheck.js
import { useEffect, useState } from 'react';
import { checkAuth } from '../services/api-client.service.js';

const useAuthCheck = () => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    username: '',
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await checkAuth();
        if (res.success) {
          setAuth({
            isLoggedIn: true,
            username: res.username,
          });
        } else {
          setAuth({
            isLoggedIn: false,
            username: '',
          });
        }
      } catch (error) {
        setAuth({
          isLoggedIn: false,
          username: '',
        });
      }
    };

    verifyAuth();
  }, []);

  return auth;
};

export default useAuthCheck;
