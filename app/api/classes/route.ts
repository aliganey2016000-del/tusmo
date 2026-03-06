import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        // ✅ BEDEL KAN: teacher: true -> teachers: true
        teachers: true, 
        _count: {
          select: { students: true } 
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(classes);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Xogta lama helin" }, { status: 500 });
  }
}