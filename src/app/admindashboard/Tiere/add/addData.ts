'use server';
import { prisma } from "@/db";


export async function addData(tierName: string, pfleger: string, tierArt: string, gebaeude: string, Revier: string) {

    await prisma.tiere.create({
        data: {
            Name: tierName,
            Pfleger: pfleger,
            created_at: new Date().toISOString()
        }
    });
    const tierID = await prisma.tiere.findFirst({
        where: {
            Name: tierName
        },
        select: {
            id: true
        }
    });
    if (tierID?.id) {
        await prisma.tierArten.create({
            data: {
                Art: tierArt,
                Geb_ude: gebaeude,
                Revier: Revier,
                TierName: tierID.id,
            }
        });
    } else {
        throw new Error("Tier ID not found");
    }
}