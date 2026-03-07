import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Qeexidda noocyada xogta (Types) si looga fogaado khaladaadka TypeScript
 */
type HeerkaWaxbarasho = "Primary" | "Middle" | "Secondary";
type XilligaFasalka = "Morning" | "Afternoon" | "Evening";

export async function GET(codsiga: Request) {
  const { searchParams } = new URL(codsiga.url);
  
  // Soo qabashada xogta miiraha ee laga soo diray qaybta hore
  const heerarkaStr = searchParams.get("levels");
  const fasalladaStr = searchParams.get("grades");
  const xilliyadaStr = searchParams.get("shifts");

  // U beddelidda qoraalka qaab Array ah
  const heerarka = heerarkaStr ? heerarkaStr.split(",") : [];
  const fasallada = fasalladaStr ? fasalladaStr.split(",") : [];
  const xilliyada = xilliyadaStr ? xilliyadaStr.split(",") : [];

  try {
    const fasalladaLaHelay = await prisma.class.findMany({
      where: {
        // Miiraha heerka waxbarashada (Primary, Middle, Secondary)
        ...(heerarka.length > 0 && { 
          level: { in: heerarka as HeerkaWaxbarasho[] } 
        }),

        // Miiraha xilliga fasalka (Morning, Afternoon, Evening)
        ...(xilliyada.length > 0 && { 
          shift: { in: xilliyada as XilligaFasalka[] } 
        }),

        // Miiraha magaca fasalka (startsWith wuxuu qabanayaa Grade 7-A, Grade 7-B)
        ...(fasallada.length > 0 && {
          OR: fasallada.map(f => ({
            name: { startsWith: f, mode: 'insensitive' } 
          }))
        }),
      },
      include: {
        teachers: true, // Soo xigashada macallimiinta fasalka loo xiray
        _count: {
          select: { students: true } // Soo xigashada tirada ardayda diwaangashan
        }
      },
      orderBy: { name: 'asc' } // Habaynta xogta sida alifbeetada
    });
    
    return NextResponse.json(fasalladaLaHelay);
  } catch (error) {
    console.error("Cillad ka timid API-ga:", error);
    return NextResponse.json({ error: "Xogta lama heli karo xilligan" }, { status: 500 });
  }
}