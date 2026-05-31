import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") || new Date().getMonth() + 1;
    const year = searchParams.get("year") || new Date().getFullYear();

    const startDate = new Date(`${year}-${String(month).padStart(2, "0")}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const [
      totalVisits,
      totalPatients,
      totalExaminations,
      visitsByStatus,
      newPatients,
    ] = await Promise.all([
      prisma.visit.count({
        where: {
          visitDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),
      prisma.patient.count({
        where: {
          deletedAt: null,
        },
      }),
      prisma.pregnancyExamination.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),
      prisma.visit.groupBy({
        by: ["status"],
        where: {
          visitDate: {
            gte: startDate,
            lt: endDate,
          },
        },
        _count: true,
      }),
      prisma.patient.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
          deletedAt: null,
        },
      }),
    ]);

    return NextResponse.json({
      month,
      year,
      totalVisits,
      totalPatients,
      totalExaminations,
      newPatients,
      visitsByStatus: Object.fromEntries(
        visitsByStatus.map((item: any) => [item.status, item._count])
      ),
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
