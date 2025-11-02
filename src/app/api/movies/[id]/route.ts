import { type NextRequest, NextResponse } from "next/server"
import { readMovies, writeMovies } from "@/lib/data-manager"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const movies = await readMovies()
    const movie = movies.find((m) => m.id === Number.parseInt(id))

    if (!movie) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: movie })
  } catch (error) {
    console.error("Error fetching movie:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch movie" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token || !verifyAuthToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const movies = await readMovies()
    const movieIndex = movies.findIndex((m) => m.id === Number.parseInt(id))

    if (movieIndex === -1) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 })
    }

    movies[movieIndex] = {
      ...movies[movieIndex],
      ...body,
      id: Number.parseInt(id),
    }

    writeMovies(movies)

    return NextResponse.json({
      success: true,
      data: movies[movieIndex],
      message: "Movie updated successfully",
    })
  } catch (error) {
    console.error("Error updating movie:", error)
    return NextResponse.json({ success: false, error: "Failed to update movie" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token || !verifyAuthToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const movies = await readMovies()
    const filteredMovies = movies.filter((m) => m.id !== Number.parseInt(id))

    if (filteredMovies.length === movies.length) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 })
    }

    writeMovies(filteredMovies)

    return NextResponse.json({
      success: true,
      message: "Movie deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting movie:", error)
    return NextResponse.json({ success: false, error: "Failed to delete movie" }, { status: 500 })
  }
}
