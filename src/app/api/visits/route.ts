import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const visits = await prisma.visit.findMany({
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        bidan: true,
      },
      orderBy: {
        visitDate: "desc",
      },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    return NextResponse.json(
      { error: "Failed to fetch visits" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newVisit = await prisma.visit.create({
      data: {
        visitNumber: data.visitNumber,
        patientId: data.patientId,
        bidanId: data.bidanId || null,
        visitDate: new Date(data.visitDate),
        serviceType: data.serviceType,
        complaint: data.complaint || null,
        status: "MENUNGGU",
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        bidan: true,
      },
    });

    return NextResponse.json(newVisit, { status: 201 });
  } catch (error) {
    console.error("Error creating visit:", error);
    return NextResponse.json(
      { error: "Failed to create visit" },
      { status: 500 }
    );
  }
}
