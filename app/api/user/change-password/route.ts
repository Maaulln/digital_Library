import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function POST(request: Request) {
  try {
    // Get user from session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    const { currentPassword, newPassword } = await request.json()

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Verify current password
    const [rows]: any = await connection.execute("SELECT id FROM users WHERE id = ? AND password = ?", [
      userId,
      currentPassword,
    ])

    if (rows.length === 0) {
      await connection.end()
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    // Update password
    await connection.execute("UPDATE users SET password = ? WHERE id = ?", [newPassword, userId])

    await connection.end()

    return NextResponse.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
