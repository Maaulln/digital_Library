import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(request) {
  try {
    const { amount, orderId, customerName, customerEmail, bookId } =
      await request.json();

    if (!amount || !orderId || !customerName || !customerEmail) {
      return NextResponse.json(
        { message: "Data pembayaran tidak lengkap" },
        { status: 400 }
      );
    }

    const snap = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail,
      },
      item_details: [
        {
          id: bookId,
          price: amount,
          quantity: 1,
          name: "Pembayaran Denda Perpustakaan",
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error("Midtrans error:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat memproses pembayaran",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
