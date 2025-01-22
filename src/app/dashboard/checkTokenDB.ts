'use server';
import { prisma } from '@/db';

export async function getToken(ptoken: string) {
    const token = prisma.user.findFirst({
        where: {
            token: ptoken
        },
        select: {
            token: true
        }
    });

    return token.then((value) => {
        return value?.token || null;
    });
 
}