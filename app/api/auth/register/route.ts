import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const userData = {
      method: "email",
      email,
      password: password,
      first_name: firstName,
      last_name: lastName,
    }

    const response = await apiClient.register(userData)

    return NextResponse.json({
      success: true,
      message: response.message,
      user: response.user,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: error.status || 500 })
  }
}
