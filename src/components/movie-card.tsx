"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Movie } from "@/lib/types";
import placeholderImg from "../../public/placeholder.svg";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <Card
        className="
          group relative h-full overflow-hidden rounded-2xl border border-border/50 
          bg-linear-to-br from-background via-background/95 to-muted/40 
          shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer
          p-0
        "
      >
        <div className="relative w-full h-72 overflow-hidden rounded-t-2xl bg-accent/20">
          <Image
            src={movie.posterUrl || placeholderImg}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="
              object-cover transition-transform duration-500 group-hover:scale-105
            "
            unoptimized
          />
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2 py-1 text-xs text-white">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>
              {movie.averageReviewRating
                ? movie.averageReviewRating.toFixed(1)
                : movie.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <CardContent className="p-4 py-0">
          <h3 className="font-semibold text-lg leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>

          <p className="text-sm text-muted-foreground mt-1">{movie.year}</p>

          <div className="flex flex-wrap gap-1 mt-3">
            {movie.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
          <span>{movie.reviewCount} reviews</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
