"use client";

import { useState } from "react";
import { Trash2, Edit2, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Movie } from "@/lib/types";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface MoviesTableProps {
  movies: Movie[];
  token: string;
  onEdit: (movie: Movie) => void;
  onMovieDeleted: () => void;
}

export function MoviesTable({
  movies,
  token,
  onEdit,
  onMovieDeleted,
}: MoviesTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const openDeleteModal = (movie: Movie) => {
    setMovieToDelete(movie);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setMovieToDelete(null);
  };

  const handleDelete = async () => {
    if (!movieToDelete) return;

    setDeletingId(movieToDelete.id);
    try {
      const response = await fetch(`/api/movies/${movieToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete movie");

      toast.success(`"${movieToDelete.title}" deleted successfully`);
      onMovieDeleted();
      closeDeleteModal();
    } catch (error) {
      toast.error("Failed to delete movie");
      console.error("Error deleting movie:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/movies/export/csv", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to export");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "movies.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Movies exported successfully");
    } catch (error) {
      toast.error("Failed to export movies");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Movies ({movies.length})</CardTitle>
          <Button
            onClick={handleExport}
            disabled={exporting}
            size="sm"
            variant="outline"
          >
            {exporting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Year</th>
                  <th className="text-left py-3 px-4 font-semibold">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Director
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Reviews</th>
                  <th className="text-right py-3 px-4 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{movie.title}</td>
                    <td className="py-3 px-4">{movie.year}</td>
                    <td className="py-3 px-4">{movie.rating.toFixed(1)}</td>
                    <td className="py-3 px-4">{movie.director}</td>
                    <td className="py-3 px-4">{movie.reviewCount}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(movie)}
                          disabled={deletingId === movie.id}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteModal(movie)}
                          disabled={deletingId === movie.id}
                        >
                          {deletingId === movie.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteModalOpen}
        title={`Delete "${movieToDelete?.title}"?`}
        description="This will permanently remove the movie and all its reviews. This action cannot be undone."
        confirmText="Delete Movie"
        loading={!!deletingId}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </>
  );
}
