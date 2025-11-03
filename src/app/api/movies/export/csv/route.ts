import { type NextRequest, NextResponse } from "next/server"
import { readMovies } from "@/lib/data-manager"
import { generateCSV } from "@/lib/csv-export"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token || !verifyAuthToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const genre = searchParams.get("genre") || ""
    const sortBy = searchParams.get("sortBy") || "rating"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    let movies = await readMovies()

    if (genre) {
      movies = movies.filter((m) => m.genre.includes(genre))
    }

    movies.sort((a, b) => {
      const aVal: any = a[sortBy as keyof typeof a]
      const bVal: any = b[sortBy as keyof typeof b]

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    const csv = generateCSV(movies)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="movies.csv"',
      },
    })
  } catch (error) {
    console.error("Error exporting CSV:", error)
    return NextResponse.json({ success: false, error: "Failed to export CSV" }, { status: 500 })
  }
}
