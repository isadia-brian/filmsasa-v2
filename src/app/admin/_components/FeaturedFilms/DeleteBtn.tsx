"use client";

import { deleteFromCarousel } from "@/features/films/server/db/films";
import { X } from "lucide-react";
import { useCallback } from "react";

const DeleteBtn = ({ tmdbId }: { tmdbId: number }) => {
  const handleDelete = useCallback(async () => {
    await deleteFromCarousel(tmdbId);
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
