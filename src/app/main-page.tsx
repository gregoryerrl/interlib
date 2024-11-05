import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { papers } from "@/mockdata/sampleData";

type Paper = {
  id: string;
  title: string;
};

export default function MainPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Papers</h1>
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
