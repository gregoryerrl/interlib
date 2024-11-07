"use client";

import { handleHeaders } from "@/hooks/api-hooks";
import { Paper, Chapter, Topic } from "@prisma/client";

interface CreatePaperData {
  title: string;
}

interface UpdatePaperData {
  title?: string;
}

// Create a new paper
export async function createPaper(data: CreatePaperData) {
  try {
    const response = await fetch("/api/paper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create paper");
    }

    const result = await response.json();
    return { paper: result.paper, error: null };
  } catch (error) {
    console.error("Failed to create paper:", error);
    return { paper: null, error: "Failed to create paper" };
  }
}

// Get all papers
export async function getAllPapers() {
  try {
    const response = await fetch("/api/paper", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch papers");
    }

    const result = await response.json();
    return { papers: result.papers, error: null };
  } catch (error) {
    console.error("Failed to fetch papers:", error);
    return { papers: null, error: "Failed to fetch papers" };
  }
}

// Get paper by ID
export async function getPaperById(id: string) {
  try {
    const response = await fetch(`/api/paper/${id}`, {
      method: "GET",
      headers: handleHeaders(true),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch paper");
    }

    const result = await response.json();
    return { paper: result, error: null };
  } catch (error) {
    console.error("Failed to fetch paper:", error);
    return { paper: null, error: "Failed to fetch paper" };
  }
}

// Update paper
export async function updatePaper(
  paper: Paper
): Promise<{ paper: Paper | null; error: string | null }> {
  try {
    const response = await fetch(`/api/paper/${paper.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paper),
    });
    if (!response.ok) {
      throw new Error("Failed to update paper");
    }
    const updatedPaper = await response.json();
    return { paper: updatedPaper, error: null };
  } catch (error) {
    console.error("Failed to update paper:", error);
    return { paper: null, error: "Failed to update paper" };
  }
}

export async function createChapter(paperId: string, title: string) {
  try {
    const response = await fetch(`/api/chapter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paperId, title }),
    });
    if (!response.ok) {
      throw new Error("Failed to create chapter");
    }
    const chapter = await response.json();
    return { chapter, error: null };
  } catch (error) {
    console.error("Failed to create chapter:", error);
    return { chapter: null, error: "Failed to create chapter" };
  }
}

export async function updateChapter(chapter: Chapter) {
  try {
    const response = await fetch(`/api/chapter/${chapter.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chapter),
    });
    if (!response.ok) {
      throw new Error("Failed to update chapter");
    }
    const updatedChapter = await response.json();
    return { chapter: updatedChapter, error: null };
  } catch (error) {
    console.error("Failed to update chapter:", error);
    return { chapter: null, error: "Failed to update chapter" };
  }
}

export async function createTopic(
  chapterId: string,
  title: string,
  content: string
) {
  try {
    const response = await fetch(`/api/topic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId, title, content }),
    });
    if (!response.ok) {
      throw new Error("Failed to create topic");
    }
    const topic = await response.json();
    return { topic, error: null };
  } catch (error) {
    console.error("Failed to create topic:", error);
    return { topic: null, error: "Failed to create topic" };
  }
}

export async function updateTopic(topic: Topic) {
  try {
    const response = await fetch(`/api/topic/${topic.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topic),
    });
    if (!response.ok) {
      throw new Error("Failed to update topic");
    }
    const updatedTopic = await response.json();
    return { topic: updatedTopic, error: null };
  } catch (error) {
    console.error("Failed to update topic:", error);
    return { topic: null, error: "Failed to update topic" };
  }
}

// Delete paper
export async function deletePaper(id: string) {
  try {
    const response = await fetch(`/api/paper/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete paper");
    }

    const result = await response.json();
    return { paper: result.paper, error: null };
  } catch (error) {
    console.error("Failed to delete paper:", error);
    return { paper: null, error: "Failed to delete paper" };
  }
}

export const deleteChapter = async (chapterId: string) => {
  try {
    const response = await fetch(`/api/chapter/${chapterId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const { error } = await response.json();
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return { success: false, error: "Failed to delete chapter" };
  }
};

export async function deleteTopic(topicId: string) {
  try {
    const response = await fetch(`/api/topic/${topicId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const { error } = await response.json();
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting topic:", error);
    return { success: false, error: "Failed to delete topic" };
  }
}
