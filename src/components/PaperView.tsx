"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TipTapEditor from "./editor/TipTapEditor";
import { getPaperById, updatePaper } from "@/actions/paperActions";

type Topic = {
  id: string;
  title: string;
  content: string;
};

type Chapter = {
  id: string;
  title: string;
  topics: Topic[];
};

type Paper = {
  id: string;
  title: string;
  chapters?: Chapter[];
};

type PaperViewProps = {
  paperId: string;
};

export default function PaperView({ paperId }: PaperViewProps) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      setIsLoading(true);
      const { paper, error } = await getPaperById(paperId);
      if (paper) {
        setPaper(paper);
      } else {
        setError(error || "Failed to fetch paper");
      }
      setIsLoading(false);
    };
    fetchPaper();
  }, [paperId]);

  const handlePaperUpdate = async (updatedPaper: Paper) => {
    const { paper: updatedPaperFromServer, error } = await updatePaper(
      paperId,
      updatedPaper
    );
    if (updatedPaperFromServer) {
      setPaper(updatedPaperFromServer);
    } else {
      setError(error || "Failed to update paper");
    }
  };

  const handlePaperTitleChange = (newTitle: string) => {
    if (paper) {
      const updatedPaper = { ...paper, title: newTitle };
      setPaper(updatedPaper);
      handlePaperUpdate(updatedPaper);
    }
  };

  const handleChapterTitleChange = (chapterId: string, newTitle: string) => {
    if (paper && paper.chapters) {
      const updatedPaper = {
        ...paper,
        chapters: paper.chapters.map((ch) =>
          ch.id === chapterId ? { ...ch, title: newTitle } : ch
        ),
      };
      setPaper(updatedPaper);
      handlePaperUpdate(updatedPaper);
    }
  };

  const handleTopicTitleChange = (
    chapterId: string,
    topicId: string,
    newTitle: string
  ) => {
    if (paper && paper.chapters) {
      const updatedPaper = {
        ...paper,
        chapters: paper.chapters.map((ch) =>
          ch.id === chapterId
            ? {
                ...ch,
                topics: ch.topics.map((t) =>
                  t.id === topicId ? { ...t, title: newTitle } : t
                ),
              }
            : ch
        ),
      };
      setPaper(updatedPaper);
      handlePaperUpdate(updatedPaper);
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic({ ...selectedTopic, title: newTitle });
      }
    }
  };

  const handleContentUpdate = (topicId: string, newContent: string) => {
    if (paper && paper.chapters) {
      const updatedPaper = {
        ...paper,
        chapters: paper.chapters.map((ch) => ({
          ...ch,
          topics: ch.topics.map((t) =>
            t.id === topicId ? { ...t, content: newContent } : t
          ),
        })),
      };
      setPaper(updatedPaper);
      handlePaperUpdate(updatedPaper);
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic({ ...selectedTopic, content: newContent });
      }
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleAddChapter = () => {
    if (paper) {
      const newChapter: Chapter = {
        id: Date.now().toString(),
        title: "New Chapter",
        topics: [],
      };
      const updatedPaper = {
        ...paper,
        chapters: [...(paper.chapters || []), newChapter],
      };
      setPaper(updatedPaper);
      handlePaperUpdate(updatedPaper);
    }
  };

  const handleAddTopic = (chapterId: string) => {
    if (paper && paper.chapters) {
      const newTopic: Topic = {
        id: Date.now().toString(),
        title: "New Topic",
        content: "New content",
      };
      const updatedPaper = {
        ...paper,
        chapters: paper.chapters.map((ch) =>
          ch.id === chapterId ? { ...ch, topics: [...ch.topics, newTopic] } : ch
        ),
      };
      setPaper(updatedPaper);
      handlePaperUpdate(updatedPaper);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!paper) return <div>No paper found</div>;

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <Link href="/" className="flex items-center text-sm font-medium mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Papers
        </Link>
        <div className="mb-4">
          <Input
            value={paper.title}
            onChange={(e) => handlePaperTitleChange(e.target.value)}
            className="font-semibold"
            disabled={!isEditing}
          />
        </div>
        {paper.chapters && paper.chapters.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {paper.chapters.map((chapter) => (
              <AccordionItem key={chapter.id} value={chapter.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <Input
                      value={chapter.title}
                      onChange={(e) =>
                        handleChapterTitleChange(chapter.id, e.target.value)
                      }
                      className="font-medium"
                      disabled={!isEditing}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddTopic(chapter.id);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-2">
                    {chapter.topics.map((topic) => (
                      <div key={topic.id} className="flex items-center gap-2">
                        <Input
                          value={topic.title}
                          onChange={(e) =>
                            handleTopicTitleChange(
                              chapter.id,
                              topic.id,
                              e.target.value
                            )
                          }
                          className="text-sm cursor-pointer"
                          disabled={!isEditing}
                          onClick={() => handleTopicSelect(topic)}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center text-gray-500">No chapters yet</div>
        )}
        {isEditing && (
          <Button
            variant="outline"
            onClick={handleAddChapter}
            className="w-full mt-4"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Chapter
          </Button>
        )}
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
        {selectedTopic ? (
          <div className="prose max-w-none">
            <h2>{selectedTopic.title}</h2>
            <TipTapEditor
              content={selectedTopic.content}
              onUpdate={(newContent) =>
                handleContentUpdate(selectedTopic.id, newContent)
              }
              editable={isEditing}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              Select a topic to view its content
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
