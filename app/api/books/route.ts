import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "../database-config";

export async function GET(request: Request) {
  try {
    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Get category query parameter
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    let query =
      "SELECT id, title, author, category, isbn, publication_year, description, cover_image, available, stock FROM books";
    let params: any[] = [];

    if (category) {
      query += " WHERE category = ?";
      params.push(category);
    }

    // Query to get books, optionally filtered by category
    const [rows]: any = await connection.execute(query, params);

    await connection.end();

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
