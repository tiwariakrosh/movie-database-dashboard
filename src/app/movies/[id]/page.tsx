"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Movie } from "@/lib/types";
import { StarRating } from "@/components/star-rating";
import { ReviewForm } from "@/components/review-form";
import { ReviewsSection } from "@/components/review-section";
import Image from "next/image";

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshReviews, setRefreshReviews] = useState(0);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/movies/${id}`);
        const data = await response.json();
        if (data.success) {
          setMovie(data.data);
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
            <Button asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Image
                  src={movie.posterUrl || "/placeholder.svg"}
                  alt={movie.title}
                  width={400}
                  height={600}
                  className="rounded-2xl shadow-lg object-cover"
                  unoptimized
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(movie.rating)} />
                    <span className="text-lg font-semibold">
                      {movie.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">{movie.year}</span>
                </div>
              </div>

              <Card>
                <CardContent className="pt-2 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Director</h3>
                    <p className="text-muted-foreground">{movie.director}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4" />
                        <h3 className="font-semibold">Runtime</h3>
                      </div>
                      <p className="text-muted-foreground">
                        {movie.runtime} minutes
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4" />
                        <h3 className="font-semibold">Reviews</h3>
                      </div>
                      <p className="text-muted-foreground">
                        {movie.reviewCount} reviews
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genre.map((g) => (
                        <span
                          key={g}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Cast</h3>
                    <p className="text-muted-foreground">
                      {movie.cast.join(", ")}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Synopsis</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {movie.synopsis}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <ReviewForm
                movieId={movie.id}
                onReviewSubmitted={() => setRefreshReviews((prev) => prev + 1)}
              />
            </div>
          </div>

          <div className="mt-12">
            <ReviewsSection
              movieId={movie.id}
              refreshTrigger={refreshReviews}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
