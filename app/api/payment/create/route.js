import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "../../database-config.js";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  console.log("📥 Request received at /api/payment/create");

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
  const { user_id, borrowing_id, amount } = requestData;
  if (!user_id || !borrowing_id || !amount) {
    return new NextResponse(
      JSON.stringify({ 
        message: "Data tidak lengkap. Diperlukan user_id, borrowing_id, dan amount" 
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

    // Check if user_id exists
    const [userRows] = await connection.execute(
      "SELECT id FROM users WHERE id = ?",
      [user_id]
    );
    if (userRows.length === 0) {
      await connection.end();
      return new NextResponse(
        JSON.stringify({ message: "User ID tidak ditemukan" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Check if borrowing_id exists
    const [borrowingRows] = await connection.execute(
      "SELECT id FROM borrowings WHERE id = ?",
      [borrowing_id]
    );
    if (borrowingRows.length === 0) {
      await connection.end();
      return new NextResponse(
        JSON.stringify({ message: "Borrowing ID tidak ditemukan" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Generate order ID unik
    const order_id = `FINE-${Date.now()}-${user_id}-${borrowing_id}`;
    
    // Simpan data pembayaran ke database tanpa payment_url karena kolom tidak ada
    const [result] = await connection.execute(
      `INSERT INTO payments (
        order_id, 
        user_id, 
        borrowing_id, 
        amount, 
        status, 
        transaction_status,
        created_at, 
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        order_id,
        user_id,
        borrowing_id,
        amount,
        "pending",
        "pending",
      ]
    );

    console.log("✅ Payment created:", result);

    await connection.end();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Pembayaran berhasil dibuat",
        data: {
          order_id,
          amount,
          status: "pending"
        }
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("🔥 Error creating payment:", error);
    
    return new NextResponse(
      JSON.stringify({
        message: "Terjadi kesalahan saat membuat pembayaran",
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
