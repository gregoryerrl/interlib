// app/api/chapter/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export async function POST(request: NextRequest) {
  try {
    const { paperId, title, order } = await request.json();

    // Validate required fields
    if (!paperId || !title) {
      return NextResponse.json(
        { error: "Paper ID and title are required" },
        { status: 400 }
      );
    }

    // Check if paper exists
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
    });

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    // Create new chapter
    const chapter = await prisma.chapter.create({
      data: {
        title,
        paperId,
        order,
      },
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { error: "Failed to create chapter" },
      { status: 500 }
    );
  }
}
