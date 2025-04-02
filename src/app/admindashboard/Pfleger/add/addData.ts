'use server';
import { prisma } from '@/db';
import axios from 'axios';


export async function addData(lastname: string, firstname: string, phonenumber: string, ort: string) {

   
    await prisma.pfleger.create({
        data: {

            LastName: lastname,
            FirstName: firstname,
            PLZ: ort,
            Phonenumber: phonenumber,
            created_at: new Date().toISOString(),
            badge: Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
        }
    });


}
