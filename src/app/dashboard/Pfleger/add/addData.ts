'use server';
import { prisma } from '@/db';
import axios from 'axios';


export async function addData(lastname: string, firstname: string, phonenumber: string, ort: string) {

    const plz = await getPLZ(ort);
    console.log(plz);
    console.log(lastname, firstname, phonenumber, plz);
    await prisma.pfleger.create({
        data: {

            LastName: lastname,
            FirstName: firstname,
            PLZ: plz,
            Phonenumber: phonenumber,
            created_at: new Date().toISOString()
        }
    });


}
async function getPLZ(ort: string) {
    let PLZ = '';
    await axios.get(`https://openplzapi.org/de/Localities?name=${ort}`).then((response) => {
        PLZ = response.data[0].postalCode;
    });
    return PLZ;
}