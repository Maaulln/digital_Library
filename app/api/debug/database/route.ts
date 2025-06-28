import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  let connection = null;

  try {
    // Buat koneksi database
    connection = await mysql.createConnection({
      host: "localhost",
      port: 3307,
      user: "root",
      password: "",
      database: "my_library",
    });

    // Periksa tabel-tabel yang ada
    const [tables] = await connection.execute("SHOW TABLES");

    // Periksa struktur tabel borrowings
    let borrowingsStructure = null;
    let borrowingsExists = false;

    for (const table of tables as any[]) {
      const tableName = Object.values(table)[0];
      if (tableName === "borrowings") {
        borrowingsExists = true;
        const [columns] = await connection.execute("DESCRIBE borrowings");
        borrowingsStructure = columns;
        break;
      }
    }

    // Periksa jumlah data di setiap tabel
    const [usersCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM users"
    );
    const [booksCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM books"
    );

    let borrowingsCount = [{ count: 0 }];
    if (borrowingsExists) {
      [borrowingsCount] = await connection.execute(
        "SELECT COUNT(*) as count FROM borrowings"
      );
    }

    // Tutup koneksi
    await connection.end();

    // Kirim respons
    return NextResponse.json({
      status: "success",
      database: {
        connection: "successful",
        tables: tables,
        counts: {
          users: (usersCount as any)[0].count,
          books: (booksCount as any)[0].count,
          borrowings: (borrowingsCount as any)[0].count,
        },
        borrowings: {
          exists: borrowingsExists,
          structure: borrowingsStructure,
        },
      },
    });
  } catch (error) {
    console.error("Database debug error:", error);

    // Tutup koneksi jika masih terbuka
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error("Error closing connection:", closeError);
      }
    }

    // Kirim respons error
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to debug database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
