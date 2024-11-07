import { BookOpenText } from "lucide-react";

export default function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse">
        <BookOpenText className="w-16 h-16 text-primary" />
      </div>
    </div>
  );
}
