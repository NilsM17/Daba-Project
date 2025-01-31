'use server';
import { prisma } from "@/db";


export async function addData(tierArt: string, futter: string, uhrzeit: string) {
    
    await prisma.futter.create({
        data: {
            TierArt: tierArt,
            Futter: futter,
            Uhrzeit: uhrzeit,
        }
    });
}
export async function getTierArten() {
    return await prisma.tierArten.findMany();
}