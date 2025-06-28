import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mysql from "mysql2/promise"
import { dbConfig } from "../../../../database-config"

// Helper function to check if user is admin
async function isAdmin() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")
  if (!sessionCookie) {
    return false
  }

  const session = JSON.parse(sessionCookie.value)
  return session.role === "admin"
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const id = params.id
    const { active } = await request.json()

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Update user status
    const [result]: any = await connection.execute("UPDATE users SET active = ? WHERE id = ?", [active ? 1 : 0, id])

    await connection.end()

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: `User ${active ? "activated" : "deactivated"} successfully`,
    })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
