import { use } from "react";
import { notFound } from "next/navigation";
import PaperView from "@/components/PaperView";

export default function PaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <PaperView paperId={id} />;
}
