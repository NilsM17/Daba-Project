'use server';
import { prisma } from "@/db";


export async function addData(tierName: string, pfleger: string, tierArt: string, gebaeude: string, Revier: string) {

   const tierartID = await prisma.tierArten.findFirst({
        where: {
            Art: tierArt
        },
        select: {
            id: true
        }
    });
    await prisma.tiere.create({
        data: {
            Name: tierName,
            Pfleger: pfleger,
            created_at: new Date().toISOString(),
            ArtenID: tierartID ? tierartID.id : '' // Assuming tierArt is the ID for the type of animal
        }
    });


}
export async function getTierArten() {
    return await prisma.tierArten.findMany();
}