import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 })
    }

    // Verify token (you'll need to use the same secret as your backend)
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any

    // In a real app, you might want to fetch fresh user data from your backend
    // For now, we'll return the decoded token data
    return NextResponse.json({
      user: {
        id: decoded.sub,
        // You might need to fetch additional user data from your backend here
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
