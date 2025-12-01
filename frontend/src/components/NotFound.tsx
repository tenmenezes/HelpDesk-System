import { CircleAlert } from "lucide-react";

export default function NotFound() {
    return (
      <>
        <div className="w-auto flex items-center justify-center gap-2">
          <CircleAlert className="h-6 w-6 text-orange-600 animate-pulse transition" />
          <span className="font-bold text-red-500">
            Nenhum registro encontrado.
          </span>
        </div>
      </>
    );
}