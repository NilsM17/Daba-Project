'use server';
import { prisma } from '@/db';  // Adjust the import based on your setup

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
