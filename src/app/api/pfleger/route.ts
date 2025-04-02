import { prisma } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pfleger = await prisma.pfleger.findMany();
    return NextResponse.json(pfleger);
  } catch (error) {
    console.error("Failed to fetch pfleger data:", error);
    return NextResponse.json(
      { error: "Failed to fetch pfleger data" },
      { status: 500 }
    );
  }
}