"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, GripVertical } from "lucide-react";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Topic = PrismaTopic & { isNew?: boolean; order: number };
type Chapter = PrismaChapter & {
  topics: Topic[];
  isNew?: boolean;
  order: number;
};
type Paper = PrismaPaper & { chapters: Chapter[] };

type PaperViewProps = {
  paperId: string;
};

function SortableChapter({
  chapter,
  isEditing,
  handleChapterTitleChange,
  handleDeleteChapter,
  handleAddTopic,
  handleTopicTitleChange,
  handleDeleteTopic,
  handleTopicSelect,
}: {
  chapter: Chapter;
  isEditing: boolean;
  handleChapterTitleChange: (chapterId: string, newTitle: string) => void;
  handleDeleteChapter: (chapterId: string) => void;
  handleAddTopic: (chapterId: string) => void;
  handleTopicTitleChange: (
    chapterId: string,
    topicId: string,
    newTitle: string
  ) => void;
  handleDeleteTopic: (chapterId: string, topicId: string) => void;
  handleTopicSelect: (topic: Topic) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <AccordionItem value={chapter.id}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {isEditing && (
                <span {...listeners}>
                  <GripVertical className="mr-2 h-4 w-4 cursor-grab" />
                </span>
              )}
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
                <span className="font-medium text-sm">{chapter.title}</span>
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
                      This action cannot be undone. This will permanently delete
                      the chapter and all its topics.
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
          <SortableContext
            items={chapter.topics.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="pl-4 space-y-2">
              {chapter.topics
                .sort((a, b) => a.order - b.order)
                .map((topic) => (
                  <SortableTopic
                    key={topic.id}
                    topic={topic}
                    chapterId={chapter.id}
                    isEditing={isEditing}
                    handleTopicTitleChange={handleTopicTitleChange}
                    handleDeleteTopic={handleDeleteTopic}
                    handleTopicSelect={handleTopicSelect}
                  />
                ))}
            </div>
          </SortableContext>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddTopic(chapter.id)}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Topic
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

function SortableTopic({
  topic,
  chapterId,
  isEditing,
  handleTopicTitleChange,
  handleDeleteTopic,
  handleTopicSelect,
}: {
  topic: Topic;
  chapterId: string;
  isEditing: boolean;
  handleTopicTitleChange: (
    chapterId: string,
    topicId: string,
    newTitle: string
  ) => void;
  handleDeleteTopic: (chapterId: string, topicId: string) => void;
  handleTopicSelect: (topic: Topic) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between"
    >
      <div
        className="flex items-center cursor-pointer"
        onClick={() => handleTopicSelect(topic)}
      >
        {isEditing && (
          <span {...listeners}>
            <GripVertical className="mr-2 h-4 w-4 cursor-grab" />
          </span>
        )}
        {isEditing ? (
          <Input
            value={topic.title}
            onChange={(e) =>
              handleTopicTitleChange(chapterId, topic.id, e.target.value)
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
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                topic and its content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteTopic(chapterId, topic.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default function PaperView({ paperId }: PaperViewProps) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [editedPaper, setEditedPaper] = useState<Paper | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchPaper = async () => {
      setIsLoading(true);
      const { paper: fetchedPaper, error } = await getPaperById(paperId);
      if (fetchedPaper) {
        const paperWithChapters = {
          ...fetchedPaper,
          chapters: (fetchedPaper.chapters || []).map((chapter, index) => ({
            ...chapter,
            order: chapter.order || index,
            topics: (chapter.topics || []).map((topic, topicIndex) => ({
              ...topic,
              order: topic.order || topicIndex,
            })),
          })),
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
        id: `new-chapter-${Date.now()}`,
        title: "New Chapter",
        topics: [],
        paperId: editedPaper.id,
        isNew: true,
        order: editedPaper.chapters.length,
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
      const chapter = editedPaper.chapters.find((c) => c.id === chapterId);
      if (chapter) {
        const newTopic: Topic = {
          id: `new-topic-${Date.now()}`,
          title: "New Topic",
          content: "This topic has no content yet",
          chapterId: chapterId,
          isNew: true,
          order: chapter.topics.length,
        };
        setEditedPaper({
          ...editedPaper,
          chapters: editedPaper.chapters.map((ch) =>
            ch.id === chapterId
              ? { ...ch, topics: [...ch.topics, newTopic] }
              : ch
          ),
        });
      }
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setEditedPaper((prev) => {
        if (!prev) return null;

        const oldIndex = prev.chapters.findIndex(
          (chapter) => chapter.id === active.id
        );
        const newIndex = prev.chapters.findIndex(
          (chapter) => chapter.id === over?.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const newChapters = arrayMove(prev.chapters, oldIndex, newIndex);
          return {
            ...prev,
            chapters: newChapters.map((chapter, index) => ({
              ...chapter,
              order: index,
            })),
          };
        }

        // Handle topic drag
        for (const chapter of prev.chapters) {
          const oldTopicIndex = chapter.topics.findIndex(
            (topic) => topic.id === active.id
          );
          const newTopicIndex = chapter.topics.findIndex(
            (topic) => topic.id === over?.id
          );

          if (oldTopicIndex !== -1 && newTopicIndex !== -1) {
            const newTopics = arrayMove(
              chapter.topics,
              oldTopicIndex,
              newTopicIndex
            );
            return {
              ...prev,
              chapters: prev.chapters.map((ch) =>
                ch.id === chapter.id
                  ? {
                      ...ch,
                      topics: newTopics.map((topic, index) => ({
                        ...topic,
                        order: index,
                      })),
                    }
                  : ch
              ),
            };
          }
        }

        return prev;
      });
    }
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
            chapter.title,
            chapter.order
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
          // Existing chapter, update if title or order changed
          const originalChapter = paper.chapters.find(
            (c) => c.id === chapter.id
          );
          if (
            originalChapter &&
            (originalChapter.title !== chapter.title ||
              originalChapter.order !== chapter.order)
          ) {
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
              topic.content,
              topic.order
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
                originalTopic.content !== topic.content ||
                originalTopic.order !== topic.order)
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={editedPaper.chapters.map((chapter) => chapter.id)}
              strategy={verticalListSortingStrategy}
            >
              <Accordion type="multiple" className="w-full">
                {editedPaper.chapters
                  .sort((a, b) => a.order - b.order)
                  .map((chapter) => (
                    <SortableChapter
                      key={chapter.id}
                      chapter={chapter}
                      isEditing={isEditing}
                      handleChapterTitleChange={handleChapterTitleChange}
                      handleDeleteChapter={handleDeleteChapter}
                      handleAddTopic={handleAddTopic}
                      handleTopicTitleChange={handleTopicTitleChange}
                      handleDeleteTopic={handleDeleteTopic}
                      handleTopicSelect={handleTopicSelect}
                    />
                  ))}
              </Accordion>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center text-gray-500 mb-4">No chapters yet</div>
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
