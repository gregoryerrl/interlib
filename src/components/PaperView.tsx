"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, FileText, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TipTapEditor from "./editor/TipTapEditor";
import {
  getPaperById,
  updatePaper,
  createChapter,
  updateChapter,
  deleteChapter,
  createTopic,
  updateTopic,
  deleteTopic,
} from "@/actions/paperActions";
import {
  Paper as PrismaPaper,
  Chapter as PrismaChapter,
  Topic as PrismaTopic,
} from "@prisma/client";
import LoadingComponent from "./LoadingComponent";

type Topic = PrismaTopic & { isNew?: boolean };
type Chapter = PrismaChapter & { topics: Topic[]; isNew?: boolean };
type Paper = PrismaPaper & { chapters: Chapter[] };

type PaperViewProps = {
  paperId: string;
};

export default function PaperView({ paperId }: PaperViewProps) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [editedPaper, setEditedPaper] = useState<Paper | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      setIsLoading(true);
      const { paper: fetchedPaper, error } = await getPaperById(paperId);
      if (fetchedPaper) {
        const paperWithChapters = {
          ...fetchedPaper,
          chapters: fetchedPaper.chapters || [],
        } as Paper;
        setPaper(paperWithChapters);
        setEditedPaper(paperWithChapters);
      } else {
        setError(error || "Failed to fetch paper");
      }
      setIsLoading(false);
    };
    fetchPaper();
  }, [paperId]);

  const handlePaperTitleChange = (newTitle: string) => {
    if (editedPaper) {
      setEditedPaper({ ...editedPaper, title: newTitle });
    }
  };

  const handleAddChapter = () => {
    if (editedPaper) {
      const newChapter: Chapter = {
        id: "", // This will be assigned by the database
        title: "New Chapter",
        topics: [],
        paperId: editedPaper.id,
        isNew: true,
      };
      setEditedPaper({
        ...editedPaper,
        chapters: [...editedPaper.chapters, newChapter],
      });
    }
  };

  const handleChapterTitleChange = (chapterId: string, newTitle: string) => {
    if (editedPaper) {
      setEditedPaper({
        ...editedPaper,
        chapters: editedPaper.chapters.map((c) =>
          c.id === chapterId ? { ...c, title: newTitle } : c
        ),
      });
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (editedPaper) {
      const chapterToDelete = editedPaper.chapters.find(
        (c) => c.id === chapterId
      );
      if (chapterToDelete && !chapterToDelete.isNew) {
        const { error } = await deleteChapter(chapterId);
        if (error) {
          setError("Failed to delete chapter");
          return;
        }
      }
      setEditedPaper({
        ...editedPaper,
        chapters: editedPaper.chapters.filter((c) => c.id !== chapterId),
      });
      if (
        selectedTopic &&
        editedPaper.chapters
          .find((c) => c.id === chapterId)
          ?.topics.some((t) => t.id === selectedTopic.id)
      ) {
        setSelectedTopic(null);
      }
    }
  };

  const handleAddTopic = (chapterId: string) => {
    if (editedPaper) {
      const newTopic: Topic = {
        id: "", // This will be assigned by the database
        title: "New Topic",
        content: "This topic has no content yet",
        chapterId: chapterId,
        isNew: true,
      };
      setEditedPaper({
        ...editedPaper,
        chapters: editedPaper.chapters.map((ch) =>
          ch.id === chapterId ? { ...ch, topics: [...ch.topics, newTopic] } : ch
        ),
      });
    }
  };

  const handleTopicTitleChange = (
    chapterId: string,
    topicId: string,
    newTitle: string
  ) => {
    if (editedPaper) {
      setEditedPaper({
        ...editedPaper,
        chapters: editedPaper.chapters.map((ch) =>
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
    }
  };

  const handleDeleteTopic = async (chapterId: string, topicId: string) => {
    if (editedPaper) {
      const chapterToUpdate = editedPaper.chapters.find(
        (c) => c.id === chapterId
      );
      const topicToDelete = chapterToUpdate?.topics.find(
        (t) => t.id === topicId
      );
      if (topicToDelete && !topicToDelete.isNew) {
        const { error } = await deleteTopic(topicId);
        if (error) {
          setError("Failed to delete topic");
          return;
        }
      }
      setEditedPaper({
        ...editedPaper,
        chapters: editedPaper.chapters.map((ch) =>
          ch.id === chapterId
            ? { ...ch, topics: ch.topics.filter((t) => t.id !== topicId) }
            : ch
        ),
      });
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic(null);
      }
    }
  };

  const handleContentUpdate = (topicId: string, newContent: string) => {
    if (editedPaper) {
      setEditedPaper({
        ...editedPaper,
        chapters: editedPaper.chapters.map((ch) => ({
          ...ch,
          topics: ch.topics.map((t) =>
            t.id === topicId ? { ...t, content: newContent } : t
          ),
        })),
      });
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic({ ...selectedTopic, content: newContent });
      }
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleSave = async () => {
    if (editedPaper && paper) {
      setIsLoading(true);

      // Update paper title if changed
      if (editedPaper.title !== paper.title) {
        const { paper: updatedPaper, error } = await updatePaper(editedPaper);
        if (error) {
          setError("Failed to update paper title");
          setIsLoading(false);
          return;
        }
      }

      // Handle chapters
      for (const chapter of editedPaper.chapters) {
        if (chapter.isNew) {
          // New chapter
          const { chapter: newChapter, error } = await createChapter(
            editedPaper.id,
            chapter.title
          );
          if (error) {
            setError("Failed to create new chapter");
            setIsLoading(false);
            return;
          }
          if (newChapter) {
            chapter.id = newChapter.id;
            delete chapter.isNew;
          }
        } else {
          // Existing chapter, update if title changed
          const originalChapter = paper.chapters.find(
            (c) => c.id === chapter.id
          );
          if (originalChapter && originalChapter.title !== chapter.title) {
            const { chapter: updatedChapter, error } = await updateChapter(
              chapter
            );
            if (error) {
              setError("Failed to update chapter");
              setIsLoading(false);
              return;
            }
          }
        }

        // Handle topics
        for (const topic of chapter.topics) {
          if (topic.isNew) {
            // New topic
            const { topic: newTopic, error } = await createTopic(
              chapter.id,
              topic.title,
              topic.content
            );
            if (error) {
              setError("Failed to create new topic");
              setIsLoading(false);
              return;
            }
            if (newTopic) {
              topic.id = newTopic.id;
              delete topic.isNew;
            }
          } else {
            // Existing topic, update if changed
            const originalTopic = paper.chapters
              .find((c) => c.id === chapter.id)
              ?.topics.find((t) => t.id === topic.id);
            if (
              originalTopic &&
              (originalTopic.title !== topic.title ||
                originalTopic.content !== topic.content)
            ) {
              const { topic: updatedTopic, error } = await updateTopic(topic);
              if (error) {
                setError("Failed to update topic");
                setIsLoading(false);
                return;
              }
            }
          }
        }
      }

      // All updates successful, update the main paper state
      setPaper(editedPaper);
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-screen">
        <LoadingComponent />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!paper || !editedPaper) return <div>No paper found</div>;

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4 overflow-auto">
        <Link href="/" className="flex items-center text-sm font-medium mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Papers
        </Link>
        <div className="mb-4">
          <Input
            value={editedPaper.title}
            onChange={(e) => handlePaperTitleChange(e.target.value)}
            className="font-semibold"
            disabled={!isEditing}
            placeholder="Paper Title"
          />
        </div>
        {editedPaper.chapters.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {editedPaper.chapters.map((chapter) => (
              <AccordionItem
                key={chapter.id || chapter.title}
                value={chapter.id || chapter.title}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Folder className="mr-2 h-4 w-4" />
                      {isEditing ? (
                        <Input
                          value={chapter.title}
                          onChange={(e) =>
                            handleChapterTitleChange(chapter.id, e.target.value)
                          }
                          className="font-medium text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="font-medium text-sm">
                          {chapter.title}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the chapter and all its topics.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteChapter(chapter.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-2">
                    {chapter.topics.map((topic) => (
                      <div
                        key={topic.id || topic.title}
                        className="flex items-center justify-between"
                      >
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleTopicSelect(topic)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {isEditing ? (
                            <Input
                              value={topic.title}
                              onChange={(e) =>
                                handleTopicTitleChange(
                                  chapter.id,
                                  topic.id,
                                  e.target.value
                                )
                              }
                              className="text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="text-sm">{topic.title}</span>
                          )}
                        </div>
                        {isEditing && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the topic and its content.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteTopic(chapter.id, topic.id)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    ))}
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTopic(chapter.id)}
                        className="w-full mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Topic
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center text-gray-500 mb-4">No chapters yet</div>
        )}
        {!isEditing && (
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
          <Button
            onClick={async () => {
              if (isEditing) {
                await handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
        {selectedTopic ? (
          <div className="max-w-none">
            <h2 className="font-bold text-xl w-100 text-center my-5">
              {selectedTopic.title}
            </h2>
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
