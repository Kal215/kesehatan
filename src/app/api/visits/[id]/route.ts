import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visit = await prisma.visit.findUnique({
      where: { id: params.id },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        bidan: true,
        examinations: true,
      },
    });

    if (!visit) {
      return NextResponse.json(
        { error: "Visit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(visit);
  } catch (error) {
    console.error("Error fetching visit:", error);
    return NextResponse.json(
      { error: "Failed to fetch visit" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updatedVisit = await prisma.visit.update({
      where: { id: params.id },
      data: {
        status: data.status,
        bidanId: data.bidanId || undefined,
        diagnosis: data.diagnosis || undefined,
        notes: data.notes || undefined,
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

    return NextResponse.json(updatedVisit);
  } catch (error) {
    console.error("Error updating visit:", error);
    return NextResponse.json(
      { error: "Failed to update visit" },
      { status: 500 }
    );
  }
}
