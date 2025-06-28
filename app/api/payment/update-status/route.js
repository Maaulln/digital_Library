import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "../../database-config"

export async function POST(request) {
  console.log("📥 Request received at /api/payment/update-status");

  let requestData;
  try {
    requestData = await request.json();
    console.log("📦 Request data:", requestData);
  } catch (err) {
    console.error("❌ Invalid JSON payload:", err.message);
    return new NextResponse(
      JSON.stringify({ message: "Invalid JSON payload" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  // Validasi data yang diperlukan
  const { borrowing_id, status, payment_type } = requestData;
  if (!borrowing_id || !status) {
    return new NextResponse(
      JSON.stringify({ 
        message: "Data tidak lengkap. Diperlukan borrowing_id dan status" 
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  // Validasi status sesuai ENUM yang didefinisikan di database
  const validStatuses = ['pending', 'success', 'failure', 'challenge'];
  if (!validStatuses.includes(status)) {
    return new NextResponse(
      JSON.stringify({ 
        message: "Status tidak valid. Status harus salah satu dari: pending, success, failure, atau challenge" 
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  // Validasi payment_type jika ada
  const validPaymentTypes = ['QRIS', 'DANA', 'OVO', 'GOPAY'];
  if (payment_type && !validPaymentTypes.includes(payment_type)) {
    return new NextResponse(
      JSON.stringify({ 
        message: "Payment type tidak valid. Tipe yang valid: QRIS, DANA, OVO, atau GOPAY" 
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Update status pembayaran berdasarkan status yang diterima
      let query = "UPDATE payments SET status = ?, transaction_status = ?, ";
      let params = [status, status];

      if (payment_type) {
        query += "payment_type = ?, ";
        params.push(payment_type);
      }

      query += "updated_at = NOW() WHERE borrowing_id = ?";
      params.push(borrowing_id);

      const [result] = await connection.execute(query, params);

      if (result.affectedRows === 0) {
        return new NextResponse(
          JSON.stringify({ 
            success: false,
            message: "Pembayaran tidak ditemukan" 
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // Update status peminjaman hanya jika pembayaran success
      if (status === "success") {
        // Mulai transaksi untuk update status peminjaman dan stok buku
        await connection.beginTransaction();
        try {
          await connection.execute(
            `UPDATE borrowings 
             SET status = 'returned',
                 return_date = NOW()
             WHERE id = ?`,
            [borrowing_id]
          );
          // Update stok buku
          const [borrowRows] = await connection.execute(
            "SELECT book_id FROM borrowings WHERE id = ? FOR UPDATE",
            [borrowing_id]
          );
          if (borrowRows.length > 0) {
            const book_id = borrowRows[0].book_id;
            await connection.execute(
              "UPDATE books SET stock = stock + 1, available = TRUE WHERE id = ?",
              [book_id]
            );
          }
          await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw error;
        }
      }

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: `Status pembayaran berhasil diperbarui menjadi ${status}`
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      throw dbError;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("🔥 Error updating payment status:", error);
    
    return new NextResponse(
      JSON.stringify({
        message: "Terjadi kesalahan saat memperbarui status pembayaran",
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}