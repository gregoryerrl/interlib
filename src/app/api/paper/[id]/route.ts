import { NextResponse } from "next/server";
import prisma from "@/prisma";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const updateData = await req.json();

    const updatedPaper = await prisma.paper.update({
      where: { id },
      data: updateData,
      include: {
        chapters: {
          include: {
            topics: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPaper);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update paper" },
      { status: 500 }
    );
  }
};
