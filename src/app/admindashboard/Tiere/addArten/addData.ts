'use server';
import { prisma } from "@/db";

export async function addData( tierArt: string, gebaeude: string, Revier: string) {
    
    await prisma.tierArten.create({
        data: {
            Art: tierArt,
            Geb_ude: gebaeude,
            Revier: Revier,
        }
    });
}
