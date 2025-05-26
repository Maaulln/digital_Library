import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

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

    // Query to get all borrowings with book and user details
    const [rows]: any = await connection.execute(
      `SELECT b.id, b.borrow_date, b.due_date, b.return_date, b.status,
        books.title as book_title, users.name as user_name
      FROM borrowings b
      JOIN books ON b.book_id = books.id
      JOIN users ON b.user_id = users.id
      ORDER BY b.borrow_date DESC`,
    )

    await connection.end()

    // Process the data to determine status
    const borrowings = rows.map((row: any) => {
      // If already marked as returned, keep that status
      if (row.status === "returned") {
        return row
      }

      // Check if overdue
      const now = new Date()
      const dueDate = new Date(row.due_date)

      if (dueDate < now && row.status !== "returned") {
        row.status = "overdue"
      }

      return row
    })

    return NextResponse.json(borrowings)
  } catch (error) {
    console.error("Error fetching borrowings:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
