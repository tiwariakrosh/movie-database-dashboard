import { type NextRequest, NextResponse } from "next/server"
import { readReviews, writeReviews, getNextReviewId, readMovies, writeMovies } from "@/lib/data-manager"
import type { Review } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const movieId = searchParams.get("movieId")

    let reviews = await readReviews()

    if (movieId) {
      reviews = reviews.filter((r) => r.movieId === Number.parseInt(movieId))
    }

    // Sort by date descending
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ success: true, data: reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const reviews = await readReviews()
    const movies = await readMovies()

    const newReview: Review = {
      id: await getNextReviewId(),
      movieId: body.movieId,
      userName: body.userName,
      rating: body.rating,
      reviewText: body.reviewText,
      createdAt: new Date().toISOString(),
    }

    reviews.push(newReview)
    writeReviews(reviews)

    // Update movie review count and average rating
    const movie = movies.find((m) => m.id === body.movieId)
    if (movie) {
      const movieReviews = reviews.filter((r) => r.movieId === body.movieId)
      movie.reviewCount = movieReviews.length
      movie.averageReviewRating = movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length
      writeMovies(movies)
    }

    return NextResponse.json(
      { success: true, data: newReview, message: "Review created successfully" },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 })
  }
}
