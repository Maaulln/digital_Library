import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function GET() {
  let connection = null

  try {
    // Buat koneksi ke MySQL tanpa memilih database
    const config = { ...dbConfig }
    delete config.database // Hapus database dari konfigurasi

    console.log("Connecting to MySQL without database selection")
    connection = await mysql.createConnection(config)

    // Coba buat database jika belum ada
    console.log("Creating database if not exists:", dbConfig.database)
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`)

    // Pilih database
    console.log("Selecting database:", dbConfig.database)
    await connection.execute(`USE ${dbConfig.database}`)

    // Buat tabel users jika belum ada
    console.log("Creating users table if not exists")
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'member') NOT NULL DEFAULT 'member',
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at DATETIME NOT NULL
      )
    `)

    // Buat tabel books jika belum ada
    console.log("Creating books table if not exists")
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        isbn VARCHAR(20) NOT NULL UNIQUE,
        publication_year INT,
        description TEXT,
        cover_image VARCHAR(255),
        available BOOLEAN NOT NULL DEFAULT TRUE
      )
    `)

    // Buat tabel borrowings jika belum ada
    console.log("Creating borrowings table if not exists")
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS borrowings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        borrow_date DATETIME NOT NULL,
        due_date DATETIME NOT NULL,
        return_date DATETIME,
        status ENUM('active', 'overdue', 'returned') NOT NULL DEFAULT 'active',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `)

    // Periksa apakah ada admin user
    console.log("Checking for admin user")
    const [adminUsers] = await connection.execute("SELECT id FROM users WHERE role = 'admin'")

    // Jika tidak ada admin user, buat satu
    if (Array.isArray(adminUsers) && adminUsers.length === 0) {
      console.log("Creating admin user")
      await connection.execute(`
        INSERT INTO users (name, email, password, role, active, created_at)
        VALUES ('Admin User', 'admin@library.com', 'admin123', 'admin', TRUE, NOW())
      `)
    }

    // Periksa apakah ada buku
    console.log("Checking for books")
    const [books] = await connection.execute("SELECT id FROM books")

    // Jika tidak ada buku, tambahkan beberapa buku sampel
    if (Array.isArray(books) && books.length === 0) {
      console.log("Adding sample books")
      await connection.execute(`
        INSERT INTO books (title, author, category, isbn, publication_year, description, available)
        VALUES 
          ('To Kill a Mockingbird', 'Harper Lee', 'Fiction', '9780061120084', 1960, 'A novel about racial inequality in the American South.', TRUE),
          ('1984', 'George Orwell', 'Fiction', '9780451524935', 1949, 'A dystopian novel about totalitarianism.', TRUE),
          ('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', '9780743273565', 1925, 'A novel about the American Dream in the Jazz Age.', TRUE)
      `)
    }

    // Tutup koneksi
    await connection.end()

    // Kirim respons sukses
    return NextResponse.json({
      status: "success",
      message: "Database and tables created successfully",
    })
  } catch (error) {
    console.error("Database creation error:", error)

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
        message: "Failed to create database and tables",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
