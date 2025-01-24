'use server';
import { prisma } from '@/db';

// Get the work time for a specific user (Jonas Kammering)
export async function getTime(userToken: string) {
    // Retrieve the session to get the user info



    // Query the Arbeitszeiten table using the user ID from the session or token
    const allArbeitszeiten = await prisma.arbeitszeiten.findMany({
        where: {
            badge: userToken,  // Assuming userId is the identifier in the table
        },
        select: {
            StartTime: true,
            EndTime: true,
        },
    });

    return allArbeitszeiten;  // Returns an array of work times
}


// Update the work time for a specific user
export async function updateTime(userToken: string, startTime: Date, endTime: Date) {
    // Find the existing work time record by name
    const existingTime = await prisma.arbeitszeiten.findFirst({
        where: {
            badge: userToken,  // Assuming userId is the identifier in the table

        },
    });

    // If the record doesn't exist, throw an error
    if (!existingTime) {
        throw new Error('Work time record not found');
    }

    // Update the record by its unique ID
    const updatedTime = await prisma.arbeitszeiten.update({
        where: {
            id: existingTime.id, // Use the ID of the found record
        },
        data: {
            StartTime: startTime.toISOString(),
            EndTime: endTime.toISOString(),
        },
    });

    return updatedTime;
}


// Add a new work time entry for a specific user
export async function addTime(startTime: Date, endTime: Date, userToken: string) {
    const newTime = await prisma.arbeitszeiten.create({
        data: {
            StartTime: startTime.toISOString(),
            EndTime: endTime.toISOString(),
            badge: userToken,  // Assuming userId is the identifier in the table

        },
    });

    return newTime;
}
