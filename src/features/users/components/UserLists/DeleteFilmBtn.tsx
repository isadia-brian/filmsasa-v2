"use client";

import { useToast } from "@/hooks/use-toast";
import { removeFromUserList } from "../../server/db";
import { X } from "lucide-react";

type DeleteFilmProps = {
  userId: number;
  tmdbId: number;
  action: "favorites" | "watchlist";
  filmTitle: string;
};

const DeleteFilmBtn = ({
  userId,
  tmdbId,
  action,
  filmTitle,
}: DeleteFilmProps) => {
  const { toast } = useToast();

  const handleClick = async () => {
    if (!userId || !tmdbId || !action || !filmTitle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "One or more fields are missing",
      });
      return;
    }

    const response = await removeFromUserList(
      userId,
      tmdbId,
      action,
      filmTitle,
    );

    const { success, message } = response;

    toast({
      title: success ? "Success" : "Error",
      variant: success ? "default" : "destructive",
      description: message,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute top-3 right-3 flex items-center justify-center rounded-full h-6 w-6 bg-red-400 cursor-pointer text-white hover:bg-red-500 transition-colors"
    >
      <X size={14} />
    </button>
  );
};

export default DeleteFilmBtn;
