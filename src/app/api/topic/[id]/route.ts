import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const topic = await request.json();

    const updatedTopic = await prisma.topic.update({
      where: {
        id: id,
      },
      data: {
        title: topic.title,
        content: topic.content,
        // Add any other fields you want to update
      },
    });

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    await prisma.topic.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
};
