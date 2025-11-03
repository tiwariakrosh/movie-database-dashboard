"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function StarRating({
  rating,
  interactive = false,
  onRatingChange,
  size = "md",
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRatingChange?.(star)}
          disabled={!interactive}
          className={`${sizeMap[size]} ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : ""
          }`}
        >
          <Star
            className={`${sizeMap[size]} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
