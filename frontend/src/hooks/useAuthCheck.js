// src/hooks/useAuthCheck.js
import { useEffect, useState } from 'react';
import { checkAuth } from '../services/api-client.service.js';

const useAuthCheck = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await checkAuth();
        setIsLoggedIn(res.success);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    verifyAuth();
  }, []);

  return isLoggedIn;
};

export default useAuthCheck;
