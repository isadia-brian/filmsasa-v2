"use client";

import { removeCategory } from "@/features/films/server/db/films";
import { X } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const DeleteBtn = ({
  tmdbId,
  category,
}: {
  tmdbId: number;
  category: string;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const handleDelete = useCallback(async () => {
    const response = await removeCategory(tmdbId, category);
    if (response.success) {
      toast({
        title: "Success",
        description: response.message,
      });
      router.refresh();
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: response.message,
      });
    }
  }, []);

  return (
    <button
      className="absolute right-2 top-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer"
      onClick={handleDelete}
    >
      <X size={16} className="text-white" />
    </button>
  );
};

export default DeleteBtn;
