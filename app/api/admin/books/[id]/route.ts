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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const id = params.id
    const bookData = await request.json()

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Update book
    const [result]: any = await connection.execute(
      `UPDATE books SET 
        title = ?, 
        author = ?, 
        category = ?, 
        isbn = ?, 
        publication_year = ?, 
        description = ?, 
        cover_image = ?, 
        available = ?, 
        stock = ?,
        content = ?
      WHERE id = ?`,
      [
        bookData.title,
        bookData.author,
        bookData.category,
        bookData.isbn,
        bookData.publication_year,
        bookData.description,
        bookData.cover_image,
        (bookData.stock && bookData.stock > 0) ? true : false,
        bookData.stock,
        bookData.content || null,
        id,
      ],
    )

    await connection.end()

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Book updated successfully",
    })
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const id = params.id

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Check if book has active borrowings
    const [borrowingRows]: any = await connection.execute(
      'SELECT id FROM borrowings WHERE book_id = ? AND status IN ("active", "overdue")',
      [id],
    )

    if (borrowingRows.length > 0) {
      await connection.end()
      return NextResponse.json({ message: "Cannot delete book with active borrowings" }, { status: 400 })
    }

    // Delete book
    const [result]: any = await connection.execute("DELETE FROM books WHERE id = ?", [id])

    await connection.end()

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Book deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
