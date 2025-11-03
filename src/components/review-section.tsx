"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import type { Review } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ReviewsSectionProps {
  movieId: number;
  refreshTrigger?: number;
}

export function ReviewsSection({
  movieId,
  refreshTrigger,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/reviews?movieId=${movieId}`);
        const data = await response.json();
        setReviews(data.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId, refreshTrigger]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as "date" | "rating")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="rating">Sort by Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No reviews yet. Be the first to review this movie!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{review.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-foreground">{review.reviewText}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
