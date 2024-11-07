import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { Paper } from "@prisma/client";

export const PATCH = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { id } = context.params; // Extract the paper ID from the request parameters
    const updateData = await req.json(); // Get the JSON payload sent in the request body

    console.log("Update Data received:", updateData);

    // Check if the update data is valid (must be an object and have chapters)
    if (!updateData || typeof updateData !== "object") {
      console.log("Invalid update data");
      return new Response("Invalid update data", { status: 400 });
    }

    // Check if the paper exists in the database
    const paper = await prisma.paper.findUnique({
      where: { id },
    });

    if (!paper) {
      console.log(`Paper with id ${id} not found`);
      return new Response("Paper not found", { status: 404 });
    }

    // Log chapters and topics structures to ensure correct data
    console.log("Chapters in Update Data:", updateData.chapters);
    updateData.chapters?.forEach((chapter: any) => {
      console.log("Chapter structure:", chapter);
      chapter.topics?.forEach((topic: any) => {
        console.log("Topic structure:", topic);
      });
    });

    // Check if chapters or topics are empty (which could cause them not to be created)
    if (updateData.chapters?.length === 0) {
      console.log("No chapters to create.");
    }

    // Proceed to create chapters and topics under the paper
    const updatedPaper = await prisma.paper.update({
      where: { id },
      data: {
        title: updateData.title, // Update the title of the paper
        chapters: {
          create:
            updateData.chapters?.map((chapter: any) => {
              if (chapter.topics?.length === 0) {
                console.log(
                  `Skipping creation of topics for chapter "${chapter.title}" due to empty topics.`
                );
              }
              return {
                title: chapter.title, // Title of the chapter
                topics: {
                  create:
                    chapter.topics?.map((topic: any) => ({
                      title: topic.title, // Title of the topic
                      content: topic.content, // Content of the topic
                    })) || [],
                },
              };
            }) || [],
        },
      },
    });

    console.log("Updated Paper:", updatedPaper);

    // Return the updated paper with new chapters and topics
    return new Response(JSON.stringify(updatedPaper), { status: 200 });
  } catch (error) {
    console.error("Error occurred in PATCH request:", error);
    return new Response("Error occurred", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  context: { params: { id: string } }
) => {
  try {
    const { id } = context.params;

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
  context: { params: { id: string } }
) => {
  try {
    console.log("Fetching paper with ID:", context.params);
    const { id } = context.params;

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
