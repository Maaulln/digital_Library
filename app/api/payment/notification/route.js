import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { dbConfig } from "../../database-config.js";

export async function POST(request) {
  console.log("📥 Request received at /api/payment/notification");

  let notificationData;
  try {
    notificationData = await request.json();
    console.log("📦 Notification data:", notificationData);
  } catch (err) {
    console.error("❌ Invalid JSON payload:", err.message);
    return new NextResponse(
      JSON.stringify({ message: "Invalid JSON payload" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }

  try {
    // Ekstrak data dari notifikasi
    const { order_id, transaction_status } = notificationData;
    
    if (!order_id || !transaction_status) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Data tidak lengkap. Diperlukan order_id dan transaction_status" 
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

    // Konversi status transaksi ke status pembayaran
    let paymentStatus = "";
    
    if (transaction_status === "settlement" || transaction_status === "capture") {
      paymentStatus = "success";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      paymentStatus = "failure";
    } else if (transaction_status === "pending") {
      paymentStatus = "pending";
    } else {
      paymentStatus = transaction_status; // Gunakan status asli jika tidak cocok
    }

    console.log(`💾 Updating DB → Order: ${order_id}, Status: ${paymentStatus}`);

    // Update database
    const connection = await mysql.createConnection(dbConfig);
    try {
      // Tambahkan logging untuk melihat status sebelumnya
      const [currentStatus] = await connection.execute(
        "SELECT status, transaction_status FROM payments WHERE order_id = ?",
        [order_id]
      );
      
      console.log("📊 Current status in DB:", currentStatus);
      
      const [result] = await connection.execute(
        `UPDATE payments SET 
          status = ?, 
          transaction_status = ?,
          updated_at = NOW()
        WHERE order_id = ?`,
        [paymentStatus, transaction_status, order_id]
      );

      console.log("✅ DB Update Result:", result);

      if (result.affectedRows === 0) {
        console.warn(`⚠️ No payment record found for order_id: ${order_id}`);
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
      
      return new NextResponse(
        JSON.stringify({ 
          success: true,
          message: "Status pembayaran berhasil diperbarui" 
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
    console.error("🔥 Error handling payment notification:", error);
    console.error("🔥 Error stack:", error.stack);
    
    return new NextResponse(
      JSON.stringify({
        message: "Terjadi kesalahan saat memproses notifikasi",
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
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