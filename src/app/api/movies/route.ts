import { type NextRequest, NextResponse } from "next/server"
import { readMovies } from "@/lib/data-manager"
import type { Movie, PaginatedResponse } from "@/lib/types"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const search = searchParams.get("search") || ""
    const genre = searchParams.get("genre") || ""
    const sortBy = searchParams.get("sortBy") || "rating"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    let movies = await readMovies()
    console.log("🚀 ~ GET ~ movies:", movies)

    if (search) {
      movies = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.director.toLowerCase().includes(search.toLowerCase()) ||
          m.cast.some((c) => c.toLowerCase().includes(search.toLowerCase())),
      )
    }

    // Genre filter
    if (genre) {
      movies = movies.filter((m) => m.genre.includes(genre))
    }

    // Sorting
    movies.sort((a, b) => {
      const aVal: any  = a[sortBy as keyof Movie]
      const bVal: any = b[sortBy as keyof Movie]

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    // Pagination
    const total = movies.length
    const totalPages = Math.ceil(total / pageSize)
    const startIdx = (page - 1) * pageSize
    const paginatedMovies = movies.slice(startIdx, startIdx + pageSize)

    const response: PaginatedResponse<Movie> = {
      data: paginatedMovies,
      total,
      page,
      pageSize,
      totalPages,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch movies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token || !verifyAuthToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const movies = await readMovies()
    console.log("🚀 ~ POST ~ movies:", movies)
    const newMovie: Movie = {
      id: Math.max(...movies.map((m) => m.id), 0) + 1,
      title: body.title,
      year: body.year,
      genre: body.genre,
      rating: body.rating,
      director: body.director,
      runtime: body.runtime,
      synopsis: body.synopsis,
      cast: body.cast,
      posterUrl: body.posterUrl,
      reviewCount: 0,
      averageReviewRating: 0,
    }

    movies.push(newMovie)

    return NextResponse.json({ success: true, data: newMovie, message: "Movie created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating movie:", error)
    return NextResponse.json({ success: false, error: "Failed to create movie" }, { status: 500 })
  }
}
