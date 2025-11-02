import type { Movie, Review } from "./types"

let moviesCache: Movie[] | null = null
let reviewsCache: Review[] | null = null

export async function readMovies(): Promise<Movie[]> {
  try {
    if (moviesCache) {
      return moviesCache
    }
    const response = await fetch(new URL("../data/movies.json", import.meta.url))
    const data = await response.json()
    moviesCache = data
    return data
  } catch (error) {
    console.error("Error reading movies:", error)
    return []
  }
}

export async function readReviews(): Promise<Review[]> {
  try {
    if (reviewsCache) {
      return reviewsCache
    }
    const response = await fetch(new URL("../data/reviews.json", import.meta.url))
    const data = await response.json()
    reviewsCache = data
    return data
  } catch (error) {
    console.error("Error reading reviews:", error)
    return []
  }
}

export function writeMovies(movies: Movie[]): void {
  try {
    moviesCache = movies  } catch (error) {
    console.error("Error writing movies:", error)
  }
}

export function writeReviews(reviews: Review[]): void {
  try {
    reviewsCache = reviews
  } catch (error) {
    console.error("Error writing reviews:", error)
  }
}

export async function getNextMovieId(): Promise<number> {
  const movies = await readMovies()
  return movies.length > 0 ? Math.max(...movies.map((m) => m.id)) + 1 : 1
}

export async function getNextReviewId(): Promise<number> {
  const reviews = await readReviews()
  return reviews.length > 0 ? Math.max(...reviews.map((r) => r.id)) + 1 : 1
}
