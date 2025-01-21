'use client';
import React, { useEffect, useState } from 'react';
import { checkDatabaseConnection } from '../checkDB';

export default function Test12() {
  const [dbStatus, setDbStatus] = useState('Checking...');

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Call the utility function to check database status
        const isConnected = await checkDatabaseConnection();
        setDbStatus(isConnected ? 'Connected' : 'Disconnected');
      } catch (error) {
        console.error('Error checking database:', error);
        setDbStatus('Error');
      }
    };

    checkDatabase();
  }, []);

  return (
    <div>
      <h1>Database Status: {dbStatus}</h1>
    </div>
  );
}
