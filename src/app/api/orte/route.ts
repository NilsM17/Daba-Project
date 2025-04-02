import { prisma } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orte = await prisma.orte.findMany();
    return NextResponse.json(orte);
  } catch (error) {
    console.error("Failed to fetch orte data:", error);
    return NextResponse.json(
      { error: "Failed to fetch orte data" },
      { status: 500 }
    );
  }
}