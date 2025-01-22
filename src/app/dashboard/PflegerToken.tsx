'use client';

import { useEffect } from 'react';
import { checkLocalStorage, setToken, checkToken } from './checkToken';

export function PflegerToken() {
  useEffect(() => {
    const verifyToken = async () => {
      const token = await checkLocalStorage();
      if (token) {
        setToken(token); // Set token in memory for client-side checks
        await checkToken(token); // Verify token
      } else {
        window.location.href = '/Login'; // Redirect if no token is found
      }
    };

    verifyToken();
  }, []);

  return null; // This component does not render UI
}
