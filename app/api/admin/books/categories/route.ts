import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mysql from "mysql2/promise"
import { dbConfig } from "../../../database-config"

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

export async function GET() {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Query to get distinct categories from books table
    const [rows]: any = await connection.execute(
      `SELECT DISTINCT category FROM books ORDER BY category ASC`
    )

    await connection.end()

    // Extract categories as array of strings
    const categories = rows.map((row: any) => row.category)

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
