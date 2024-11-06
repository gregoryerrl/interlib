"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { papers } from "@/mockdata/sampleData";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import { get } from "http";

type Paper = {
  id: string;
  title: string;
};

export default function Home() {
  const [title, setTitle] = useState("New Paper");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [paper, setPaper] = useState<Paper | null>(null);

  const createPaper = async () => {
    try {
      const response = await fetch("/api/paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const papers = await response.json();
        console.log("New paper created:", paper);
      } else {
        console.error("Failed to create paper:", response.status);
      }
    } catch (error) {
      console.error("Error creating paper:", error);
    }
  };

  useEffect(() => {
    const getPapers = async () => {
      try {
        const response = await fetch("/api/paper", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Papers fetched:", data);
        setPapers(data.papers);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };
    getPapers();
  });

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/paper/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Paper deleted:", id);
      } else {
        console.error("Failed to delete paper:", response.status);
      }
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2">
        <h1 className="text-2xl font-bold mb-4">Papers</h1>
        <Button onClick={createPaper}>
          <Plus />
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {papers.map((paper) => (
          <Card key={paper.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <Link href={`/paper/${paper.id}`} className="hover:underline">
                  {paper.title}
                </Link>
                <Button
                  variant={"ghost"}
                  className="text-red-500"
                  onClick={() => handleDelete(paper.id)}
                >
                  <Trash />
                </Button>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
