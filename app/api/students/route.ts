import db from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    const students = await db.student.findMany({
      where: {
        // TANI WAA MEESHA SAXDA AH: Waa in "Inactive" lagu daraa si aanu u tirmin
        status: { 
          in: ["Active", "Pending", "Inactive"] 
        },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        class: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("API Students Error:", error);
    return NextResponse.json({ error: "Failed to fetch students." }, { status: 500 });
  }
}