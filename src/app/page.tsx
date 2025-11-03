"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MovieCard } from "@/components/movie-card";
import type { Movie, PaginatedResponse } from "@/lib/types";
import { DashboardFilters } from "@/components/dashboard-filters";
import { Pagination } from "@/components/pagination";

export default function DashboardPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
        genre,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/movies?${params}`);
      const data: PaginatedResponse<Movie> = await response.json();

      setMovies(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, genre, sortBy, sortOrder]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleGenreChange = (value: string) => {
    setGenre(value === "all" ? "" : value);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Movie Database</h1>
            <p className="text-muted-foreground">
              Browse and discover movies from our collection
            </p>
          </div>

          <DashboardFilters
            onSearchChange={handleSearchChange}
            onGenreChange={handleGenreChange}
            onSortChange={handleSortChange}
            onPageSizeChange={handlePageSizeChange}
            genres={[]}
          />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No movies found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
