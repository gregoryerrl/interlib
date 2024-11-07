import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export async function POST(request: NextRequest) {
  try {
    const { chapterId, title, content } = await request.json();

    // Validate required fields
    if (!chapterId || !title) {
      return NextResponse.json(
        { error: "Chapter ID and title are required" },
        { status: 400 }
      );
    }

    // Check if chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Create new topic
    const topic = await prisma.topic.create({
      data: {
        title,
        content: content || "", // Make content optional with default empty string
        chapterId,
      },
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
