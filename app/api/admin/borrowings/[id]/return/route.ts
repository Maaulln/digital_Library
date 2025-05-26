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

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Start a transaction
    await connection.beginTransaction()

    try {
      // Get borrowing details
      const [borrowingRows]: any = await connection.execute("SELECT book_id, status FROM borrowings WHERE id = ?", [id])

      if (borrowingRows.length === 0) {
        await connection.rollback()
        await connection.end()
        return NextResponse.json({ message: "Borrowing record not found" }, { status: 404 })
      }

      if (borrowingRows[0].status === "returned") {
        await connection.rollback()
        await connection.end()
        return NextResponse.json({ message: "Book already returned" }, { status: 400 })
      }

      const bookId = borrowingRows[0].book_id
      const returnDate = new Date()

      // Update borrowing record
      await connection.execute('UPDATE borrowings SET return_date = ?, status = "returned" WHERE id = ?', [
        returnDate,
        id,
      ])

      // Update book availability
      await connection.execute("UPDATE books SET available = LEAST(available + 1, stock) WHERE id = ?", [bookId])

      // Commit the transaction
      await connection.commit()
      await connection.end()

      return NextResponse.json({
        message: "Book marked as returned successfully",
        returnDate: returnDate.toISOString(),
      })
    } catch (error) {
      await connection.rollback()
      await connection.end()
      throw error
    }
  } catch (error) {
    console.error("Error marking book as returned:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
