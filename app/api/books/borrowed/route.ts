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

    // Query to get all active borrowings for the user with book details
    const [rows]: any = await connection.execute(
      `SELECT b.id, b.book_id, b.borrow_date, b.due_date, b.status,
        books.title as book_title, books.author as book_author, books.cover_image
      FROM borrowings b
      JOIN books ON b.book_id = books.id
      WHERE b.user_id = ? AND b.status IN ('active', 'overdue')
      ORDER BY b.borrow_date DESC`,
      [userId],
    )

    await connection.end()

    // Process the data to determine status
    const borrowedBooks = rows.map((row: any) => {
      // Check if overdue
      const now = new Date()
      const dueDate = new Date(row.due_date)

      if (dueDate < now && row.status !== "returned") {
        row.status = "overdue"
      }

      return row
    })

    return NextResponse.json(borrowedBooks)
  } catch (error) {
    console.error("Error fetching borrowed books:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
