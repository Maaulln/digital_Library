import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mysql from "mysql2/promise";
import { dbConfig } from "../../database-config";

// Helper function to check if user is admin
async function isAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) {
    return false;
  }

  const session = JSON.parse(sessionCookie.value);
  return session.role === "admin";
}

export async function GET() {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Get total books count
    const [booksResult]: any = await connection.execute(
      "SELECT COUNT(*) as total FROM books"
    );
    const totalBooks = booksResult[0].total;

    // Get available books count
    const [availableResult]: any = await connection.execute(
      "SELECT COUNT(*) as total FROM books WHERE available = (stock - 1 > 0)"
    );
    const availableBooks = availableResult[0].total;

    // Get total stock count
    const [stockResult]: any = await connection.execute(
      "SELECT SUM(stock) as total FROM books"
    );
    const totalStock = stockResult[0].total || 0;

    // Get total users count
    const [usersResult]: any = await connection.execute(
      "SELECT COUNT(*) as total FROM users"
    );
    const totalUsers = usersResult[0].total;

    // Get active loans count
    const [loansResult]: any = await connection.execute(
      'SELECT COUNT(*) as total FROM borrowings WHERE status IN ("active", "overdue")'
    );
    const activeLoans = loansResult[0].total;

    await connection.end();

    return NextResponse.json({
      totalBooks,
      availableBooks,
      totalUsers,
      activeLoans,
      totalStock,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
