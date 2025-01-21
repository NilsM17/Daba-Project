'use server';
import { prisma } from "@/db";
import * as crypto from 'crypto';
import { checkToken, setToken } from '../dashboard/checkToken';

export async function login(username: string, password: string) {
    const securePassword = crypto.createHash('sha1').update(password).digest('hex');
    const user = await prisma.user.findFirst({
        where: {
            username: username,
            password: securePassword
        }
    });
    if (!user) {
        return null;
    }
    const token = crypto.randomBytes(32).toString('hex');

    return token;
}