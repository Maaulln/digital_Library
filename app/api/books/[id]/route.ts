import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  let connection = null
  try {
    const params = await context.params
    const bookId = params.id
    if (!bookId) {
      return NextResponse.json({ message: "Book ID is required" }, { status: 400 })
    }

    connection = await mysql.createConnection(dbConfig)

    const [rows] = await connection.execute(
      "SELECT id, title, author, category, isbn, publication_year, description, cover_image, available, content FROM books WHERE id = ?",
      [bookId]
    )

    const books = Array.isArray(rows) ? rows : []

    if (books.length === 0) {
      await connection.end()
      return NextResponse.json({ message: "Book not found" }, { status: 404 })
    }

    const book = books[0]

    await connection.end()

    return NextResponse.json(book)
  } catch (error) {
    if (connection) {
      try {
        await connection.end()
      } catch {}
    }
    console.error("Error fetching book details:", error)
    return NextResponse.json(
      { message: "Failed to fetch book details" },
      { status: 500 }
    )
  }
}
