import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "../../database-config.js";

export async function POST(request) {
  console.log("📥 Request received at /api/payment/sync");

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
  const { order_id, status } = requestData;
  if (!order_id || !status) {
    return new NextResponse(
      JSON.stringify({ 
        message: "Data tidak lengkap. Diperlukan order_id dan status" 
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
    // Validasi status yang diberikan
    const validStatuses = ["pending", "success", "failure", "expired"];
    if (!validStatuses.includes(status)) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Status tidak valid. Status yang valid: pending, success, failure, expired" 
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

    console.log(`💾 Syncing payment → Order: ${order_id}, Status: ${status}`);

    // Update database
    const connection = await mysql.createConnection(dbConfig);
    try {
      // Cek apakah pembayaran ada
      const [payment] = await connection.execute(
        "SELECT * FROM payments WHERE order_id = ?",
        [order_id]
      );
      
      if (payment.length === 0) {
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
      
      // Update status pembayaran
      const [result] = await connection.execute(
        `UPDATE payments SET 
          status = ?, 
          transaction_status = ?,
          updated_at = NOW()
        WHERE order_id = ?`,
        [status, status, order_id]
      );

      console.log("✅ DB Update Result:", result);

      // Ambil data pembayaran yang sudah diupdate
      const [updatedPayment] = await connection.execute(
        "SELECT * FROM payments WHERE order_id = ?",
        [order_id]
      );
      
      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Status pembayaran berhasil disinkronkan",
          data: updatedPayment[0]
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
    console.error("🔥 Error syncing payment:", error);
    
    return new NextResponse(
      JSON.stringify({
        message: "Terjadi kesalahan saat menyinkronkan pembayaran",
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");
  
  if (!orderId) {
    return new NextResponse(
      JSON.stringify({ message: "Parameter order_id diperlukan" }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        } 
      }
    );
  }
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
      const [rows] = await connection.execute(
        `SELECT 
          p.id, 
          p.order_id, 
          p.user_id, 
          p.borrowing_id, 
          p.amount, 
          p.status, 
          p.transaction_status, 
          p.payment_url,
          p.created_at, 
          p.updated_at,
          u.name as user_name,
          b.book_id
        FROM 
          payments p
        LEFT JOIN 
          users u ON p.user_id = u.id
        LEFT JOIN 
          borrowings b ON p.borrowing_id = b.id
        WHERE 
          p.order_id = ?`,
        [orderId]
      );
      
      if (rows.length === 0) {
        return new NextResponse(
          JSON.stringify({ message: "Pembayaran tidak ditemukan" }),
          { 
            status: 404, 
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*" 
            } 
          }
        );
      }
      
      return new NextResponse(
        JSON.stringify({ 
          success: true, 
          data: rows[0] 
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          } 
        }
      );
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      throw dbError;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("🔥 Error fetching payment:", error);
    
    return new NextResponse(
      JSON.stringify({
        message: "Terjadi kesalahan saat mengambil data pembayaran",
        error: error.message
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        } 
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}