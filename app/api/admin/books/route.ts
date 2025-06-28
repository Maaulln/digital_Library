import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mysql from "mysql2/promise";
import { dbConfig } from "../../database-config";

// Helper function to check if user is admin
async function isAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) {
    return false;
  }

  const session = JSON.parse(sessionCookie.value);
  return session.role === "admin";
}

export async function GET() {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Query to get all books with detailed information
      const [rows]: any = await connection.execute(
      `SELECT id, title, author, category, isbn, publication_year, 
      description, cover_image, available, stock, content FROM books`
    );

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const bookData = await request.json();

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Insert new book
    const [result]: any = await connection.execute(
      `INSERT INTO books (title, author, category, isbn, publication_year, 
      description, cover_image, available, stock, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookData.title,
        bookData.author,
        bookData.category,
        bookData.isbn,
        bookData.publication_year,
        bookData.description,
        bookData.cover_image,
        bookData.stock && bookData.stock > 0 ? true : false,
        bookData.stock || 0,
        bookData.content || null,
      ]
    );

    await connection.end();

    return NextResponse.json({
      message: "Book added successfully",
      bookId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
