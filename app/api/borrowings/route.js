import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "../database-config";

export async function POST(request) {
  try {
    const { user_id, book_id, borrow_date, due_date } = await request.json();

    if (!user_id || !book_id || !borrow_date || !due_date) {
      return NextResponse.json(
        { message: "Data peminjaman tidak lengkap" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
      await connection.beginTransaction();

      // Check if book is available
      const [bookRows] = await connection.execute(
        "SELECT stock FROM books WHERE id = ? FOR UPDATE",
        [book_id]
      );

      if (bookRows.length === 0) {
        await connection.rollback();
        return NextResponse.json(
          { message: "Buku tidak ditemukan" },
          { status: 404 }
        );
      }

      if (bookRows[0].stock <= 0) {
        await connection.rollback();
        return NextResponse.json(
          { message: "Stock buku tidak tersedia untuk dipinjam" },
          { status: 400 }
        );
      }

      // Insert borrowing record
      const [result] = await connection.execute(
        `INSERT INTO borrowings (user_id, book_id, borrow_date, due_date, status)
         VALUES (?, ?, ?, ?, 'active')`,
        [user_id, book_id, borrow_date, due_date]
      );

      // Update book stock, and update available based on new stock value
      await connection.execute(
        "UPDATE books SET stock = stock - 1 WHERE id = ?",
        [book_id]
      );
      // Update available field explicitly based on current stock
      await connection.execute(
        "UPDATE books SET available = (stock > 0) WHERE id = ?",
        [book_id]
      );

      await connection.commit();

      return NextResponse.json(
        { success: true, message: "Peminjaman berhasil dibuat", borrowing_id: result.insertId },
        { status: 201 }
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error creating borrowing:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat peminjaman", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { borrowing_id, status, return_date } = await request.json();

    if (!borrowing_id || !status) {
      return NextResponse.json(
        { message: "Data tidak lengkap. Diperlukan borrowing_id dan status" },
        { status: 400 }
      );
    }

    if (status !== "returned") {
      return NextResponse.json(
        { message: "Status tidak valid. Hanya status 'returned' yang didukung untuk update" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
      await connection.beginTransaction();

      // Get borrowing record
      const [borrowRows] = await connection.execute(
        "SELECT book_id, status FROM borrowings WHERE id = ? FOR UPDATE",
        [borrowing_id]
      );

      if (borrowRows.length === 0) {
        await connection.rollback();
        return NextResponse.json(
          { message: "Peminjaman tidak ditemukan" },
          { status: 404 }
        );
      }

      // Check if the book is already returned
      if (borrowRows[0].status === "returned") {
        await connection.rollback();
        return NextResponse.json(
          { message: "Buku ini sudah dikembalikan sebelumnya" },
          { status: 400 }
        );
      }

      const book_id = borrowRows[0].book_id;

      // Update borrowing status and return_date
      await connection.execute(
        `UPDATE borrowings
         SET status = ?, return_date = ?
         WHERE id = ?`,
        [status, return_date || new Date(), borrowing_id]
      );

      // Update book stock and update available based on new stock value
      await connection.execute(
        "UPDATE books SET stock = stock + 1 WHERE id = ?",
        [book_id]
      );
      // Update available field explicitly based on current stock
      await connection.execute(
        "UPDATE books SET available = (stock > 0) WHERE id = ?",
        [book_id]
      );

      await connection.commit();

      return NextResponse.json(
        { success: true, message: "Peminjaman berhasil diperbarui dan stok buku diupdate" },
        { status: 200 }
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error updating borrowing:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memperbarui peminjaman", error: error.message },
      { status: 500 }
    );
  }
}
