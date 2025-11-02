import { generateAuthToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = generateAuthToken(body.password)

    if (!token) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      data: { token },
      message: "Login successful",
    })
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
