// "use client";

// import type React from "react";

// import { useState, useEffect } from "react";
// import { Loader2, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import type { Movie } from "@/lib/types";
// import { toast } from "sonner";

// interface MovieAddFormProps {
//   movie?: Movie;
//   token: string;
//   onSubmitSuccess: () => void;
//   onCancel: () => void;
// }

// const GENRES = [
//   "Action",
//   "Adventure",
//   "Animation",
//   "Crime",
//   "Drama",
//   "Fantasy",
//   "Mystery",
//   "Romance",
//   "Sci-Fi",
//   "Thriller",
// ];

// export function MovieAddForm({
//   movie,
//   token,
//   onSubmitSuccess,
//   onCancel,
// }: MovieAddFormProps) {
//   const [formData, setFormData] = useState({
//     title: "",
//     year: new Date().getFullYear(),
//     genre: [] as string[],
//     rating: 7.5,
//     director: "",
//     runtime: 120,
//     synopsis: "",
//     cast: [] as string[],
//     posterUrl: "",
//   });
//   const [castInput, setCastInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (movie) {
//       setFormData({
//         title: movie.title,
//         year: movie.year,
//         genre: movie.genre,
//         rating: movie.rating,
//         director: movie.director,
//         runtime: movie.runtime,
//         synopsis: movie.synopsis,
//         cast: movie.cast,
//         posterUrl: movie.posterUrl,
//       });
//     }
//   }, [movie]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.title || !formData.director || formData.genre.length === 0) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       const url = movie ? `/api/movies/${movie.id}` : "/api/movies";
//       const method = movie ? "PUT" : "POST";

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) throw new Error("Failed to save movie");
//       toast.success(
//         movie ? "Movie updated successfully" : "Movie created successfully"
//       );
//       onSubmitSuccess();
//     } catch (error) {
//       toast.error("Failed to save movie");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleGenre = (genre: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       genre: prev.genre.includes(genre)
//         ? prev.genre.filter((g) => g !== genre)
//         : [...prev.genre, genre],
//     }));
//   };

//   const addCast = () => {
//     if (castInput.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         cast: [...prev.cast, castInput.trim()],
//       }));
//       setCastInput("");
//     }
//   };

//   const removeCast = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       cast: prev.cast.filter((_, i) => i !== index),
//     }));
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{movie ? "Edit Movie" : "Add New Movie"}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium mb-2 block">Title *</label>
//               <Input
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, title: e.target.value }))
//                 }
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block">
//                 Director *
//               </label>
//               <Input
//                 value={formData.director}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, director: e.target.value }))
//                 }
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block">Year</label>
//               <Input
//                 type="number"
//                 value={formData.year}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     year: Number.parseInt(e.target.value),
//                   }))
//                 }
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block">
//                 Runtime (minutes)
//               </label>
//               <Input
//                 type="number"
//                 value={formData.runtime}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     runtime: Number.parseInt(e.target.value),
//                   }))
//                 }
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block">Rating</label>
//               <Input
//                 type="number"
//                 step="0.1"
//                 min="0"
//                 max="10"
//                 value={formData.rating}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     rating: Number.parseFloat(e.target.value),
//                   }))
//                 }
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block">
//                 Poster URL
//               </label>
//               <Input
//                 value={formData.posterUrl}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     posterUrl: e.target.value,
//                   }))
//                 }
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm font-medium mb-2 block">Genres *</label>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//               {GENRES.map((genre) => (
//                 <button
//                   key={genre}
//                   type="button"
//                   onClick={() => toggleGenre(genre)}
//                   disabled={loading}
//                   className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
//                     formData.genre.includes(genre)
//                       ? "bg-primary text-primary-foreground"
//                       : "bg-muted text-muted-foreground hover:bg-muted/80"
//                   }`}
//                 >
//                   {genre}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="text-sm font-medium mb-2 block">Synopsis</label>
//             <Textarea
//               value={formData.synopsis}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, synopsis: e.target.value }))
//               }
//               disabled={loading}
//               rows={4}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium mb-2 block">Cast</label>
//             <div className="flex gap-2 mb-2">
//               <Input
//                 value={castInput}
//                 onChange={(e) => setCastInput(e.target.value)}
//                 placeholder="Enter actor name"
//                 disabled={loading}
//                 onKeyPress={(e) =>
//                   e.key === "Enter" && (e.preventDefault(), addCast())
//                 }
//               />
//               <Button
//                 type="button"
//                 onClick={addCast}
//                 disabled={loading}
//                 variant="outline"
//               >
//                 Add
//               </Button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {formData.cast.map((actor, index) => (
//                 <div
//                   key={index}
//                   className="bg-muted px-3 py-1 rounded-full flex items-center gap-2"
//                 >
//                   <span className="text-sm">{actor}</span>
//                   <button
//                     type="button"
//                     onClick={() => removeCast(index)}
//                     disabled={loading}
//                     className="hover:text-destructive"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button type="submit" disabled={loading} className="flex-1">
//               {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//               {movie ? "Update Movie" : "Create Movie"}
//             </Button>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect } from "react";
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

export function MovieModalForm({
  movie,
  token,
  open,
  onOpenChange,
  onSubmitSuccess,
}: MovieModalFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
    genre: [] as string[],
    rating: 7.5,
    director: "",
    runtime: 120,
    synopsis: "",
    cast: [] as string[],
    posterUrl: "",
  });
  const [castInput, setCastInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when movie or open changes
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
        setFormData({
          title: "",
          year: new Date().getFullYear(),
          genre: [],
          rating: 7.5,
          director: "",
          runtime: 120,
          synopsis: "",
          cast: [],
          posterUrl: "",
        });
      }
      setCastInput("");
    }
  }, [movie, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.director || formData.genre.length === 0) {
      toast.error("Please fill in all required fields");
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

      if (!res.ok) throw new Error("Failed to save movie");

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
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(g)
        ? prev.genre.filter((x) => x !== g)
        : [...prev.genre, g],
    }));
  };

  const addCast = () => {
    if (castInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        cast: [...prev.cast, castInput.trim()],
      }));
      setCastInput("");
    }
  };

  const removeCast = (i: number) => {
    setFormData((prev) => ({
      ...prev,
      cast: prev.cast.filter((_, idx) => idx !== i),
    }));
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
              <label className="text-sm font-medium mb-1 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Director *
              </label>
              <Input
                value={formData.director}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, director: e.target.value }))
                }
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Year</label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, year: Number(e.target.value) }))
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Runtime (min)
              </label>
              <Input
                type="number"
                value={formData.runtime}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    runtime: Number(e.target.value),
                  }))
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Rating (0–10)
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, rating: Number(e.target.value) }))
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Poster URL
              </label>
              <Input
                value={formData.posterUrl}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, posterUrl: e.target.value }))
                }
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Genres *</label>
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
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Synopsis</label>
            <Textarea
              value={formData.synopsis}
              onChange={(e) =>
                setFormData((p) => ({ ...p, synopsis: e.target.value }))
              }
              disabled={loading}
              rows={4}
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
