import type { Movie } from "./types"

export function generateCSV(movies: Movie[]): string {
  const headers = [
    "ID",
    "Title",
    "Year",
    "Genre",
    "Rating",
    "Director",
    "Runtime",
    "Cast",
    "Review Count",
    "Average Rating",
  ]

  const rows = movies.map((movie) => [
    movie.id,
    `"${movie.title}"`,
    movie.year,
    `"${movie.genre.join(", ")}"`,
    movie.rating,
    `"${movie.director}"`,
    movie.runtime,
    `"${movie.cast.join(", ")}"`,
    movie.reviewCount,
    movie.averageReviewRating.toFixed(1),
  ])

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
  return csv
}
