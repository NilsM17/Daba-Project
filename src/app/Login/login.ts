'use server';
import { prisma } from "@/db";
import * as crypto from 'crypto';
import { checkToken, setToken } from '../admindashboard/checkToken';

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
    //put the token into the DB
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            token: token
        }
    });

    return token;
}
export async function checkRights(username: string, password: string): Promise<string | undefined> {
    const securePassword = crypto.createHash('sha1').update(password).digest('hex');

    const Rights = await prisma.user.findFirst({
      where: {
        username: username,
        password: securePassword,
      },
      select: {
        userRights: true,
      },
    });
  
    // Ensure the value is returned as a string, or undefined if not found
    return Rights?.userRights ? Rights.userRights.toString() : undefined;
  }
  