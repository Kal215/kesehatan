import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        deletedAt: null,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newPatient = await prisma.patient.create({
      data: {
        nik: data.nik,
        medicalRecordNo: data.medicalRecordNo,
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        phoneNumber: data.phoneNumber,
        bloodType: data.bloodType || null,
        pregnancyHistory: data.pregnancyHistory || null,
        userId: data.userId,
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

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}
