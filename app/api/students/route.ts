import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    const students = await db.student.findMany({
      where: {
        // TANI WAA MUHIIM: Waxay soo saaraysaa kaliya kuwa la oggol yahay
        status: { 
          in: ["Active", "Pending"] 
        },
        // Waxay ku dhex raadinaysaa magaca ama email-ka
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("API Students Error:", error);
        return NextResponse.json({ error: "Failed to fetch students." });
      }
    }