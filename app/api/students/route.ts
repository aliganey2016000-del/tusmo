import db from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma, EducationLevel } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 1. Pagination Params
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10; 
  const skip = (page - 1) * limit;

  // 2. Filter Params
  const heerarkaRaw = searchParams.get("levels")?.split(",").filter(Boolean) || [];
  const xaaladaha = searchParams.get("statuses")?.split(",").filter(Boolean) || [];
  const raadin = searchParams.get("query") || "";

  try {
    // 3. Dhisidda Sifeeyaha (Where Clause)
    const sifeeye: Prisma.StudentWhereInput = {
      ...(raadin && {
        OR: [
          { name: { contains: raadin, mode: 'insensitive' } },
          { email: { contains: raadin, mode: 'insensitive' } },
        ],
      }),
      ...(xaaladaha.length > 0 && {
        status: { in: xaaladaha }
      }),
      // XALKA "ANY": Waxaan u beddelnay EducationLevel[] (Strict Type)
      ...(heerarkaRaw.length > 0 && {
        class: {
          level: { in: heerarkaRaw as EducationLevel[] }
        }
      })
    };

    // 4. Parallel Queries (Si uu u noqdo mid aad u dhakhso badan)
    const [students, total, activeCount, pendingCount] = await Promise.all([
      db.student.findMany({
        where: sifeeye,
        include: { class: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip,
      }),
      db.student.count({ where: sifeeye }),
      db.student.count({ where: { status: "Active" } }),
      db.student.count({ where: { status: "Pending" } }),
    ]);

    // 5. Soo celinta Natiijada
    return NextResponse.json({
      students,
      pagination: {
        total,
        pageCount: Math.ceil(total / limit),
        currentPage: page
      },
      stats: {
        totalAll: total,
        active: activeCount,
        pending: pendingCount
      }
    });

  } catch (error) {
    // XALKA "UNUSED-VARS": Waxaan u log-garaynay error-ka si loo isticmaalo variable-ka
    console.error("API Error - Students Page:", error);
    return NextResponse.json(
      { error: "Waa lagu guuleysan waayay soo raridda xogta ardayda" }, 
      { status: 500 }
    );
  }
}