'use server';
import { prisma } from '@/db';

// Get the work time for a specific user (Jonas Kammering)
export async function getTime() {
    const allArbeitszeiten = await prisma.arbeitszeiten.findMany({
        select: {
            StartTime: true,
            EndTime: true,
            badge: true,
            id: true,
        },
    });

    return allArbeitszeiten;  // Returns all work times, not filtered by badge
}

export async function updateTime(id: string, startTime: Date, endTime: Date, badge: string) {
    // Ensure we update using a unique identifier (id)
    const existingTime = await prisma.arbeitszeiten.findUnique({
        where: { id },
    });

    if (!existingTime) {
        throw new Error('Work time record not found');
    }

    const updatedTime = await prisma.arbeitszeiten.update({
        where: { id },
        data: {
            StartTime: startTime.toISOString(),
            EndTime: endTime.toISOString(),
            badge: badge,  // Update the badge
        },
    });

    return updatedTime;
}

// Add a new work time entry for a specific user
export async function addTime(startTime: Date, endTime: Date, badge: string) {
    const newTime = await prisma.arbeitszeiten.create({
        data: {
            StartTime: startTime.toISOString(),
            EndTime: endTime.toISOString(),
            badge: badge,  // Set the badge
        },
    });

    return newTime;
}

export async function getuserbadge() {
    // Fetch all users with badges assigned
    const usersWithBadges = await prisma.pfleger.findMany({
        where: {
            badge: {
                not: null,  // Ensures we're only fetching users with a badge
            }
        },
        select: {
            LastName: true,   // Assuming you're storing the user's last name
            badge: true,   // Badge assigned to the user
        },
    });

    return usersWithBadges;  // Return all users with badges
}
export async function deleteTime(id: string) {
    const existingTime = await prisma.arbeitszeiten.findUnique({
      where: { id },
    });
  
    if (!existingTime) {
      throw new Error('Work time record not found');
    }
  
    await prisma.arbeitszeiten.delete({
      where: { id },
    });
  
    return { message: 'Work time deleted successfully' };
  }