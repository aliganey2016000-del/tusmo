import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Ka soo saar database-ka dhammaan codsiyada macallimiinta
    const applications = await prisma.instructorApplication.findMany({
      orderBy: {
        createdAt: "desc", // Kuwa cusub kor halagu soo daro
      },
    });

    // U soo celi xogta qaab JSON ah
    return NextResponse.json(applications);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Xogta lama soo helin" },
      { status: 500 }
    );
  }
}