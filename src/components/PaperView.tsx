"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TipTapEditor from "./editor/TipTapEditor";

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
  chapters: Chapter[];
};

type PaperViewProps = {
  initialPaper: Paper;
};

export default function PaperView({ initialPaper }: PaperViewProps) {
  const [paper, setPaper] = useState(initialPaper);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handlePaperTitleChange = (newTitle: string) => {
    setPaper({ ...paper, title: newTitle });
  };

  const handleChapterTitleChange = (chapterId: string, newTitle: string) => {
    setPaper({
      ...paper,
      chapters: paper.chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, title: newTitle } : ch
      ),
    });
  };

  const handleTopicTitleChange = (
    chapterId: string,
    topicId: string,
    newTitle: string
  ) => {
    setPaper({
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
    });
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic({ ...selectedTopic, title: newTitle });
    }
  };

  const handleContentUpdate = (topicId: string, newContent: string) => {
    setPaper({
      ...paper,
      chapters: paper.chapters.map((ch) => ({
        ...ch,
        topics: ch.topics.map((t) =>
          t.id === topicId ? { ...t, content: newContent } : t
        ),
      })),
    });

    // Update the selectedTopic state with the new content
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic({ ...selectedTopic, content: newContent });
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };
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
        <Accordion type="multiple" className="w-full">
          {paper.chapters.map((chapter) => (
            <AccordionItem key={chapter.id} value={chapter.id}>
              <AccordionTrigger className="hover:no-underline">
                <Input
                  value={chapter.title}
                  onChange={(e) =>
                    handleChapterTitleChange(chapter.id, e.target.value)
                  }
                  className={`${isEditing ? "" : "hidden"} font-medium`}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className={`${isEditing ? "hidden" : ""} font-medium`}>
                  {chapter.title}
                </span>
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
                        className={`${
                          isEditing ? "" : "hidden"
                        } text-sm cursor-pointer`}
                      />
                      <span
                        className={`${
                          isEditing ? "hidden" : ""
                        } text-sm cursor-pointer`}
                        onClick={() => handleTopicSelect(topic)}
                      >
                        {topic.title}
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
        {selectedTopic ? (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">{selectedTopic.title}</h2>
            <TipTapEditor
              content={selectedTopic?.content || ""}
              onUpdate={(newContent) =>
                handleContentUpdate(selectedTopic?.id || "", newContent)
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
