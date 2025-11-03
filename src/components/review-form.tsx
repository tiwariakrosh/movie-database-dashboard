"use client";

import type React from "react";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import { toast } from "sonner";

interface ReviewFormProps {
  movieId: number;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ movieId, onReviewSubmitted }: ReviewFormProps) {
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !reviewText.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          userName,
          rating,
          reviewText,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      toast.success("Your review has been posted!");

      setUserName("");
      setRating(5);
      setReviewText("");
      onReviewSubmitted();
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Name</label>
            <Input
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Rating</label>
            <StarRating
              rating={rating}
              interactive
              onRatingChange={setRating}
              size="lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Review</label>
            <Textarea
              placeholder="Share your thoughts about this movie..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
