import db from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; // Soo xigo Prisma types

export const dynamic = 'force-dynamic';

/**
 * GET: Soo xigashada ardayda iyadoo la adeegsanayo miirayaal dhowr ah.
 * Hadda waa Type-safe maadaama database-ka iyo Prisma Client ay is-waafaqsan yihiin.
 */
export async function GET(codsiga: Request) {
  const { searchParams } = new URL(codsiga.url);
  
  const heerarkaStr = searchParams.get("levels");
  const xaaladahaStr = searchParams.get("statuses");
  const raadin = searchParams.get("query") || "";

  const heerarka = heerarkaStr ? heerarkaStr.split(",") : [];
  const xaaladaha = xaaladahaStr ? xaaladahaStr.split(",") : [];

  try {
    // Dhisidda miiraha (Filter) iyadoo la isticmaalayo Prisma types halkii 'any' laga isticmaali lahaa
    const sifeeye: Prisma.StudentWhereInput = {
      // A. Miiraha Raadinta (Magaca ama Email-ka)
      ...(raadin && {
        OR: [
          { name: { contains: raadin, mode: 'insensitive' } },
          { email: { contains: raadin, mode: 'insensitive' } },
        ],
      }),

      // B. Miiraha Xaaladda (Active, Inactive, Pending)
      ...(xaaladaha.length > 0 && {
        status: { in: xaaladaha }
      }),

      // C. Miiraha Heerka Waxbarashada (Level)
      ...(heerarka.length > 0 && {
        class: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          level: { in: heerarka as any[] } 
        }
      })
    };

    const ardayda = await db.student.findMany({
      where: sifeeye,
      include: {
        class: true, 
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(ardayda);
  } catch (error) {
    console.error("Cillad ka timid API-ga ardayda:", error);
    return NextResponse.json(
      { error: "Laguma guuleysan in la soo xigto xogta ardayda xilligan." }, 
      { status: 500 }
    );
  }
}