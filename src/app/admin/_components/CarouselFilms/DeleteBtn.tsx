"use client";

import { deleteFromCarousel } from "@/features/films/server/actions/films";
import { X } from "lucide-react";
import { useCallback } from "react";

const DeleteBtn = ({ tmdbId }: { tmdbId: number }) => {
  const handleDelete = useCallback(async () => {
    await deleteFromCarousel(tmdbId);
  }, []);

  return (
    <button
      className="absolute right-1.5 top-1.5 h-10 w-10 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer"
      onClick={handleDelete}
    >
      <X size={24} className="text-white" />
    </button>
  );
};

export default DeleteBtn;
