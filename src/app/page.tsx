"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { papers } from "@/mockdata/sampleData";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import LoadingComponent from "@/components/LoadingComponent";
import { getAllPapers } from "@/actions/paperActions";

type Paper = {
  id: string;
  title: string;
};

export default function Home() {
  const [title, setTitle] = useState("New Paper");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPapers = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    getPapers();
  }, []);

  const createPaper = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (response.ok) {
        const newPaper = await response.json();
        await setPapers([...papers, newPaper]);
        console.log("New paper created:", newPaper);
      } else {
        console.error("Failed to create paper:", response.status);
      }
    } catch (error) {
      console.error("Error creating paper:", error);
    } finally {
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/paper/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Paper deleted:", id);
        setPapers(papers.filter((paper) => paper.id !== id));
      } else {
        console.error("Failed to delete paper:", response.status);
      }
    } catch (error) {
      console.error("Error deleting paper:", error);
    } finally {
      setLoading(false);
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
      {loading ? (
        <div className="h-96">
          <LoadingComponent />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <Card key={`paper-${paper.id}`}>
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
      )}
    </div>
  );
}
