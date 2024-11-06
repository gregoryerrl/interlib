"use client";

import { handleHeaders } from "@/hooks/api-hooks";
import { Paper } from "@prisma/client";

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
export async function updatePaper(id: string, data: {}) {
  try {
    const response = await fetch(`/api/paper/${id}`, {
      method: "PATCH",
      headers: handleHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update paper");
    }

    const result = await response.json();
    return { paper: result.paper, error: null };
  } catch (error) {
    console.error("Failed to update paper:", error);
    return { paper: null, error: "Failed to update paper" };
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
