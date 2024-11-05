"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { papers } from "@/mockdata/sampleData";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { get } from "http";

export default function Home() {
  const [title, setTitle] = useState("New Paper");

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
        const paper = await response.json();
        console.log("New paper created:", paper);
        setTitle("");
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
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };
    getPapers();
  });
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
              <CardTitle>
                <Link href={`/paper/${paper.id}`} className="hover:underline">
                  {paper.title}
                </Link>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
