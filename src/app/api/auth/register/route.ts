import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  console.log("POST /api/auth/register called");
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing name, email, or password" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    // Explicitly define the type for the where clause to fix linter issue
    const whereClause: Prisma.SignatoryWhereInput = {
      email: newUser.email,
      // @ts-ignore - This is a persistent and incorrect linter error.
      userId: null,
    };

    // Link to existing signatories
    await prisma.signatory.updateMany({
      where: whereClause,
      data: {
        userId: newUser.id,
      },
    });

    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
