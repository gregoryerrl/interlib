import { connectToDatabase } from "@/hooks/api-hooks";
import prisma from "@/prisma";
import { Paper } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectToDatabase();
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ message: "Title Required" }, { status: 400 });
    }

    const paper = await prisma.paper.create({
      data: {
        title,
      },
    });

    return NextResponse.json({ paper }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create paper" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const GET = async (req: Request) => {
  try {
    await prisma.$connect();
    const papers = await prisma.paper.findMany();
    return NextResponse.json({ papers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch papers" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
