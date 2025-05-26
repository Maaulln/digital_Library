import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function GET() {
  try {
    // Get user from session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Query to get user profile
    const [rows]: any = await connection.execute("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [
      userId,
    ])

    await connection.end()

    if (rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Get user from session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    const { name } = await request.json()

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Update user profile
    const [result]: any = await connection.execute("UPDATE users SET name = ? WHERE id = ?", [name, userId])

    await connection.end()

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update session with new name
    const updatedSession = {
      ...session,
      name,
    }

    const cookieStore2 = await cookies()
    cookieStore2.set({
      name: "session",
      value: JSON.stringify(updatedSession),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
