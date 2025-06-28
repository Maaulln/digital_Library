import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function POST(request: Request) {
  try {
    const { bookId } = await request.json()

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

    // Start a transaction
    await connection.beginTransaction()

    try {
      // Find active borrowing for this user and book
      const [borrowingRows]: any = await connection.execute(
        'SELECT id FROM borrowings WHERE user_id = ? AND book_id = ? AND status IN ("active", "overdue")',
        [userId, bookId],
      )

      if (borrowingRows.length === 0) {
        await connection.rollback()
        await connection.end()
        return NextResponse.json({ message: "No active borrowing found for this book" }, { status: 404 })
      }

      const borrowingId = borrowingRows[0].id
      const returnDate = new Date()

      // Update borrowing record
      await connection.execute('UPDATE borrowings SET return_date = ?, status = "returned" WHERE id = ?', [
        returnDate,
        borrowingId,
      ])

      // Update book availability
      await connection.execute("UPDATE books SET stock = stock + 1, available = true WHERE id = ?", [bookId])

      // Commit the transaction
      await connection.commit()
      await connection.end()

      return NextResponse.json({
        message: "Book returned successfully",
        returnDate: returnDate.toISOString(),
      })
    } catch (error) {
      await connection.rollback()
      await connection.end()
      throw error
    }
  } catch (error) {
    console.error("Error returning book:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
