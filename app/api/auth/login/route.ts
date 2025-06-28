import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Query to check user credentials
    const [rows]: any = await connection.execute(
      "SELECT id, name, email, role FROM users WHERE email = ? AND password = ? AND active = 1",
      [email, password], // Note: In a real app, you should hash passwords
    )

    await connection.end()

    if (rows.length === 0) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const user = rows[0]

    // Set a session cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "session",
      value: JSON.stringify({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
