import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function POST(request: Request) {
  // Variabel untuk koneksi database
  let connection = null

  try {
    // 1. Ambil bookId dari request
    const { bookId } = await request.json()
    console.log("Attempting to borrow book with ID:", bookId)

    if (!bookId) {
      return NextResponse.json({ message: "Book ID is required" }, { status: 400 })
    }

    // 2. Periksa session user
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    if (!sessionCookie) {
      return NextResponse.json({ message: "You must be logged in to borrow books" }, { status: 401 })
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch (error) {
      return NextResponse.json({ message: "Invalid session. Please log in again." }, { status: 401 })
    }

    const userId = session.userId
    if (!userId) {
      return NextResponse.json({ message: "Invalid user session" }, { status: 401 })
    }

    console.log("User ID from session:", userId)

    // 3. Buat koneksi database
    try {
      connection = await mysql.createConnection(dbConfig)
      console.log("Database connection established successfully")
    } catch (error) {
      console.error("Database connection error:", error)
      return NextResponse.json(
        {
          message: "Could not connect to the database. Please try again later.",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // 4. Periksa apakah buku ada dan tersedia
    const [bookRows] = await connection.execute("SELECT id, stock FROM books WHERE id = ?", [bookId])

    // Konversi hasil query ke array
    const books = Array.isArray(bookRows) ? bookRows : []

    if (books.length === 0) {
      await connection.end()
      return NextResponse.json({ message: "Book not found" }, { status: 404 })
    }

    const book = books[0] as any

    if (book.stock <= 0) {
      await connection.end()
      return NextResponse.json({ message: "This book is currently unavailable for borrowing" }, { status: 400 })
    }

    // 5. Periksa apakah user sudah meminjam buku ini
    const [borrowingRows] = await connection.execute(
      'SELECT id FROM borrowings WHERE user_id = ? AND book_id = ? AND status IN ("active", "overdue")',
      [userId, bookId],
    )

    // Konversi hasil query ke array
    const borrowings = Array.isArray(borrowingRows) ? borrowingRows : []

    if (borrowings.length > 0) {
      await connection.end()
      return NextResponse.json({ message: "You already have this book borrowed" }, { status: 400 })
    }

    // 6. Mulai transaksi
    await connection.beginTransaction()

    try {
      // 7. Set tanggal peminjaman dan jatuh tempo
      const borrowDate = new Date()
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)

      // 8. Buat record peminjaman
      await connection.execute(
        "INSERT INTO borrowings (user_id, book_id, borrow_date, due_date, status) VALUES (?, ?, ?, ?, ?)",
        [userId, bookId, borrowDate, dueDate, "active"],
      )

      // 9. Update stock dan status ketersediaan buku
      await connection.execute(
        "UPDATE books SET stock = stock - 1, available = (stock - 1 > 0) WHERE id = ?",
        [bookId]
      )

      // 10. Commit transaksi
      await connection.commit()

      // 11. Tutup koneksi
      await connection.end()

      // 12. Kirim respons sukses
      return NextResponse.json({
        message: "Book borrowed successfully",
        dueDate: dueDate.toISOString(),
      })
    } catch (error) {
      // Rollback jika ada error
      if (connection) {
        await connection.rollback()
      }
      throw error
    }
  } catch (error) {
    console.error("Error in borrow process:", error)

    // Tutup koneksi jika masih terbuka
    if (connection) {
      try {
        await connection.end()
      } catch (closeError) {
        console.error("Error closing connection:", closeError)
      }
    }

    // Kirim respons error
    return NextResponse.json(
      {
        message: "Failed to borrow book. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}