"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Movie } from "@/lib/types";

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Crime",
  "Drama",
  "Fantasy",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

interface MovieModalFormProps {
  movie?: Movie;
  token: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: () => void;
}

const initialForm = {
  title: "",
  year: new Date().getFullYear(),
  genre: [] as string[],
  rating: 5.0,
  director: "",
  runtime: 120,
  synopsis: "",
  cast: [] as string[],
  posterUrl: "",
};

export function MovieModalForm({
  movie,
  token,
  open,
  onOpenChange,
  onSubmitSuccess,
}: MovieModalFormProps) {
  const [formData, setFormData] = useState(initialForm);
  const [castInput, setCastInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation rules
  const validate = (data: typeof formData) => {
    const errors: Record<string, string> = {};

    if (!data.title.trim()) errors.title = "Title is required";
    if (!data.director.trim()) errors.director = "Director is required";
    if (data.genre.length === 0) errors.genre = "Select at least one genre";
    if (data.year < 1888 || data.year > new Date().getFullYear() + 5)
      errors.year = "Invalid year";
    if (data.runtime < 1 || data.runtime > 600)
      errors.runtime = "Runtime must be 1–600 min";
    if (data.rating < 0 || data.rating > 5)
      errors.rating = "Rating must be 0–5";

    return errors;
  };

  // Reset form on open/edit
  useEffect(() => {
    if (open) {
      if (movie) {
        setFormData({
          title: movie.title,
          year: movie.year,
          genre: movie.genre,
          rating: movie.rating,
          director: movie.director,
          runtime: movie.runtime,
          synopsis: movie.synopsis,
          cast: movie.cast,
          posterUrl: movie.posterUrl,
        });
      } else {
        setFormData(initialForm);
      }
      setCastInput("");
      setErrors({});
    }
  }, [movie, open]);

  // Real-time validation
  const validateField = useCallback(
    (name: string, value: any) => {
      const temp = { ...formData, [name]: value };
      const err = validate(temp);
      setErrors((prev) => ({ ...prev, [name]: err[name] || "" }));
    },
    [formData]
  );

  const handleChange = (name: string, value: any) => {
    setFormData((p) => ({ ...p, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      const url = movie ? `/api/movies/${movie.id}` : "/api/movies";
      const method = movie ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(movie ? "Movie updated!" : "Movie created!");
      onSubmitSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save movie");
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (g: string) => {
    const newGenres = formData.genre.includes(g)
      ? formData.genre.filter((x) => x !== g)
      : [...formData.genre, g];
    handleChange("genre", newGenres);
  };

  const addCast = () => {
    if (castInput.trim()) {
      handleChange("cast", [...formData.cast, castInput.trim()]);
      setCastInput("");
    }
  };

  const removeCast = (i: number) => {
    handleChange(
      "cast",
      formData.cast.filter((_, idx) => idx !== i)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{movie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                disabled={loading}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-destructive text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Director <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.director}
                onChange={(e) => handleChange("director", e.target.value)}
                disabled={loading}
                className={errors.director ? "border-destructive" : ""}
              />
              {errors.director && (
                <p className="text-destructive text-xs mt-1">
                  {errors.director}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Year</label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => handleChange("year", Number(e.target.value))}
                disabled={loading}
                className={errors.year ? "border-destructive" : ""}
              />
              {errors.year && (
                <p className="text-destructive text-xs mt-1">{errors.year}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Runtime (min)
              </label>
              <Input
                type="number"
                value={formData.runtime}
                onChange={(e) =>
                  handleChange("runtime", Number(e.target.value))
                }
                disabled={loading}
                className={errors.runtime ? "border-destructive" : ""}
              />
              {errors.runtime && (
                <p className="text-destructive text-xs mt-1">
                  {errors.runtime}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Rating (0-5)
              </label>
              <Input
                type="number"
                step="0.5"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => handleChange("rating", Number(e.target.value))}
                disabled={loading}
                className={errors.rating ? "border-destructive" : ""}
              />
              {errors.rating && (
                <p className="text-destructive text-xs mt-1">{errors.rating}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Poster URL
              </label>
              <Input
                value={formData.posterUrl}
                onChange={(e) => handleChange("posterUrl", e.target.value)}
                disabled={loading}
                placeholder="https://..."
                className={errors.posterUrl ? "border-destructive" : ""}
              />
              {errors.posterUrl && (
                <p className="text-destructive text-xs mt-1">
                  {errors.posterUrl}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Genres <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  disabled={loading}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    formData.genre.includes(g)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.genre && (
              <p className="text-destructive text-xs mt-1">{errors.genre}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Synopsis</label>
            <Textarea
              value={formData.synopsis}
              onChange={(e) => handleChange("synopsis", e.target.value)}
              disabled={loading}
              rows={4}
              placeholder="A brief summary..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Cast</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={castInput}
                onChange={(e) => setCastInput(e.target.value)}
                placeholder="Actor name"
                disabled={loading}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCast())
                }
              />
              <Button
                type="button"
                onClick={addCast}
                disabled={loading}
                variant="outline"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.cast.map((actor, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm"
                >
                  {actor}
                  <button
                    type="button"
                    onClick={() => removeCast(i)}
                    disabled={loading}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {movie ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
