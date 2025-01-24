'use server';
import { prisma } from '@/db';

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Perform a simple query to test the database connection
    await prisma.user.count();
    return true; // If successful, return true
  } catch (error) {
    console.error('Database connection failed:', error);
    return false; // If failed, return false
  }
};