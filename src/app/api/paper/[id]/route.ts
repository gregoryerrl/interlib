import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { Paper } from "@prisma/client";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const id = (await params).id; // Extract the paper ID from the request parameters
    const updateData = await req.json();

    console.log("Received Update Data:", updateData);

    // Validate incoming data
    if (!updateData || typeof updateData !== "object" || !updateData.title) {
      return new NextResponse("Invalid update data", { status: 400 });
    }

    // Check if the paper exists
    const existingPaper = await prisma.paper.findUnique({
      where: { id },
    });
    if (!existingPaper) {
      console.log(`Paper with id ${id} not found`);
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Update the paper, including chapters and topics
    const updatedPaper = await prisma.paper.update({
      where: { id },
      data: {
        title: updateData.title,
        chapters: {
          // Use 'set' and 'upsert' for efficient updates and inserts
          upsert:
            updateData.chapters?.map((chapter: any, chapterIndex: number) => ({
              where: { id: chapter.id || "" },
              update: {
                title: chapter.title,
                order: chapter.order || chapterIndex,
                topics: {
                  upsert:
                    chapter.topics?.map((topic: any, topicIndex: number) => ({
                      where: { id: topic.id || "" },
                      update: {
                        title: topic.title,
                        content: topic.content,
                        order: topic.order || topicIndex,
                      },
                      create: {
                        title: topic.title,
                        content: topic.content,
                        order: topic.order || topicIndex,
                      },
                    })) || [],
                },
              },
              create: {
                title: chapter.title,
                order: chapter.order || chapterIndex,
                topics: {
                  create:
                    chapter.topics?.map((topic: any, topicIndex: number) => ({
                      title: topic.title,
                      content: topic.content,
                      order: topic.order || topicIndex,
                    })) || [],
                },
              },
            })) || [],
        },
      },
      include: {
        chapters: {
          include: { topics: true },
        },
      },
    });

    console.log("Updated Paper:", updatedPaper);

    return NextResponse.json(updatedPaper, { status: 200 });
  } catch (error: any) {
    console.error("Error in PATCH request:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const id = (await params).id;

    // Delete related topics and chapters first due to referential integrity
    await prisma.topic.deleteMany({
      where: {
        chapter: {
          paperId: id,
        },
      },
    });

    await prisma.chapter.deleteMany({
      where: {
        paperId: id,
      },
    });

    // Finally delete the paper
    const deletedPaper = await prisma.paper.delete({
      where: { id },
    });

    return NextResponse.json(deletedPaper);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete paper" },
      { status: 500 }
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    console.log("Fetching paper with ID:", params);
    const id = (await params).id;

    const paper: any = await prisma.paper.findUniqueOrThrow({
      where: { id },
      include: {
        chapters: {
          include: {
            topics: true,
          },
        },
      },
    });

    if (!paper) {
      return NextResponse.json({ message: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json(paper);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch paper" },
      { status: 500 }
    );
  }
};
