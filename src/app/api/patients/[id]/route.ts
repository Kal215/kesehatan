import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        visits: {
          orderBy: {
            visitDate: "desc",
          },
          take: 10,
        },
        examinations: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updatedPatient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        nik: data.nik,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        address: data.address,
        phoneNumber: data.phoneNumber,
        bloodType: data.bloodType || null,
        pregnancyHistory: data.pregnancyHistory || null,
        user: data.name || data.email ? {
          update: {
            name: data.name,
            email: data.email,
          },
        } : undefined,
      },
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

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    await prisma.patient.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
      },
    });

    await prisma.user.delete({
      where: { id: patient.userId },
    });

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );
  }
}
