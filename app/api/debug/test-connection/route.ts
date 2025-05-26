import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function GET() {
  let connection = null

  try {
    console.log("Attempting to connect to database with config:", {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
    })

    // Coba buat koneksi ke database
    connection = await mysql.createConnection(dbConfig)
    console.log("Database connection successful")

    // Coba jalankan query sederhana
    const [result] = await connection.execute("SELECT 1 as test")
    console.log("Query result:", result)

    // Periksa tabel-tabel yang ada
    const [tables] = await connection.execute("SHOW TABLES")
    console.log("Tables in database:", tables)

    // Periksa apakah tabel borrowings ada
    let borrowingsExists = false
    for (const table of tables as any[]) {
      const tableName = Object.values(table)[0]
      if (tableName === "borrowings") {
        borrowingsExists = true
        break
      }
    }

    // Jika tabel borrowings ada, periksa strukturnya
    let borrowingsStructure = null
    if (borrowingsExists) {
      const [columns] = await connection.execute("DESCRIBE borrowings")
      borrowingsStructure = columns
    }

    // Tutup koneksi
    await connection.end()
    console.log("Connection closed")

    // Kirim respons sukses
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      config: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        database: dbConfig.database,
      },
      tables: tables,
      borrowings: {
        exists: borrowingsExists,
        structure: borrowingsStructure,
      },
    })
  } catch (error) {
    console.error("Database connection test error:", error)

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
        status: "error",
        message: "Failed to connect to database",
        error: error instanceof Error ? error.message : "Unknown error",
        config: {
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          database: dbConfig.database,
        },
      },
      { status: 500 },
    )
  }
}
