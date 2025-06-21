import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { apiClient } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const response = await apiClient.login({ email, password })

    if (response.token && response.user) {
      // Set httpOnly cookie
      const cookieStore = await cookies()
      cookieStore.set("auth-token", response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return NextResponse.json({
        success: true,
        user: response.user,
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: error.status || 500 })
  }
}
