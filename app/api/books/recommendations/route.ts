import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig)

    // Query to get recommended books (available = true)
    const query = "SELECT id, title, author, category, isbn, publication_year, description, cover_image, available " +
                  "FROM books " +
                  "WHERE available = TRUE " +
                  "ORDER BY id DESC " +
                  "LIMIT 20"

    const [rows]: any = await connection.execute(query)

    await connection.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching recommended books:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
