import { use } from "react";
import { notFound } from "next/navigation";
import PaperView from "@/components/PaperView";
import { papers } from "@/mockdata/sampleData";

export default function PaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const paper = papers.find((p) => p.id === id);

  if (!paper) {
    notFound();
  }

  return <PaperView initialPaper={paper} />;
}
