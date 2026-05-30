import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const midwives = await prisma.midwife.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(midwives);
  } catch (error) {
    console.error("Error fetching midwives:", error);
    return NextResponse.json(
      { error: "Failed to fetch midwives" },
      { status: 500 }
    );
  }
}
