import { type NextRequest, NextResponse } from "next/server"
import { readReviews } from "@/lib/data-manager"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const reviews = await readReviews()
    const review = reviews.find((r) => r.id === Number.parseInt(id))

    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    console.error("Error fetching review:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch review" }, { status: 500 })
  }
}
