import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "../database-config";

export async function GET(request: Request) {
  try {
    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Get category and year query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const year = url.searchParams.get("year");

    console.log("Received category:", category, "year:", year);

    let query =
      "SELECT id, title, author, category, isbn, publication_year, description, cover_image, available, stock FROM books";
    let params: any[] = [];

    if (category && year) {
      query += " WHERE category = ? AND publication_year = ?";
      params.push(category, year);
    } else if (category) {
      query += " WHERE category = ?";
      params.push(category);
    } else if (year) {
      query += " WHERE publication_year = ?";
      params.push(year);
    }

    console.log("Executing query:", query, "with params:", params);

    // Query to get books, optionally filtered by category and/or year
    const [rows]: any = await connection.execute(query, params);

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
