"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Movie } from "@/lib/types";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative w-full h-64 bg-muted overflow-hidden">
          <img
            src={movie.posterUrl || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{movie.year}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {movie.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
              >
                {g}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          {movie.reviewCount} reviews • {movie.averageReviewRating.toFixed(1)}{" "}
          avg
        </CardFooter>
      </Card>
    </Link>
  );
}
