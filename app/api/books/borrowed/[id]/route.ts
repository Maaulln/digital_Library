import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mysql from "mysql2/promise"
import { dbConfig } from "../../../database-config"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  let connection = null
  try {
    const bookId = parseInt(params.id, 10)
    if (isNaN(bookId)) {
      return NextResponse.json({ message: "Invalid book ID" }, { status: 400 })
    }

    // Check user session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    if (!sessionCookie) {
      return NextResponse.json({ borrowed: false, message: "Not logged in" }, { status: 401 })
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json({ borrowed: false, message: "Invalid session" }, { status: 401 })
    }

    const userId = session.userId
    if (!userId) {
      return NextResponse.json({ borrowed: false, message: "Invalid user session" }, { status: 401 })
    }

    // Connect to DB
    connection = await mysql.createConnection(dbConfig)

    // Check if user has active or overdue borrowing for the book
    const [rows] = await connection.execute(
      'SELECT id FROM borrowings WHERE user_id = ? AND book_id = ? AND status IN ("active", "overdue")',
      [userId, bookId]
    )

    const borrowings = Array.isArray(rows) ? rows : []

    await connection.end()

    if (borrowings.length > 0) {
      return NextResponse.json({ borrowed: true })
    } else {
      return NextResponse.json({ borrowed: false })
    }
  } catch (error) {
    if (connection) {
      try {
        await connection.end()
      } catch {}
    }
    return NextResponse.json({ borrowed: false, message: "Error checking borrowing status" }, { status: 500 })
  }
}
