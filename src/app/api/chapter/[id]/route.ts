// app/api/chapter/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const chapter = await request.json();

    const updatedChapter = await prisma.chapter.update({
      where: {
        id: id,
      },
      data: {
        title: chapter.title,
        // Add any other fields you want to update
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("Error updating chapter:", error);
    return NextResponse.json(
      { error: "Failed to update chapter" },
      { status: 500 }
    );
  }
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.topic.deleteMany({
      where: { chapterId: id },
    });

    await prisma.chapter.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Chapter and related topics deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chapter and topics:", error);
    return NextResponse.json(
      { error: "Failed to delete chapter and related topics" },
      { status: 500 }
    );
  }
}
