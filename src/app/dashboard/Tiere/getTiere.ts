'use server'; // Optional for clarity, but the default is server-side
import { prisma } from '@/db';

export async function getTiere() {
  return prisma.tiere.findMany(); // Replace with your actual query
}

export async function getPfleger() {
  return prisma.pfleger.findMany(); // Replace with your actual query
}

export async function getTierart() {
  return prisma.tierArten.findMany(); // Replace with your actual query
}
