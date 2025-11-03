"use client";

import { useState, useEffect } from "react";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Movie, PaginatedResponse } from "@/lib/types";
import { AdminLogin } from "@/components/login";
import { MovieModalForm } from "@/components/movie-add-form";
import { MoviesTable } from "@/components/movie-table";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const openModal = (movie?: Movie) => {
    setEditingMovie(movie || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMovie(null);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchMovies();
    }
  }, [token]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/movies?pageSize=1000");
      const data: PaginatedResponse<Movie> = await response.json();
      setMovies(data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setEditingMovie(null);
  };

  if (!token) {
    return (
      <>
        <Header />
        <AdminLogin onLoginSuccess={setToken} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex w-full flex-col gap-4">
                  <div className="flex items-center">
                    <h3 className="text-2xl font-semibold">
                      List of All Movies
                    </h3>
                    <Button
                      onClick={() => openModal()}
                      className="w-fit ml-auto"
                      size="lg"
                    >
                      Add New Movie
                    </Button>
                  </div>
                  <MoviesTable
                    movies={movies}
                    token={token}
                    onEdit={(movie) => openModal(movie)}
                    onMovieDeleted={fetchMovies}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MovieModalForm
        movie={editingMovie || undefined}
        token={token}
        open={modalOpen}
        onOpenChange={closeModal}
        onSubmitSuccess={() => {
          fetchMovies();
          closeModal();
        }}
      />

      <Footer />
    </>
  );
}
