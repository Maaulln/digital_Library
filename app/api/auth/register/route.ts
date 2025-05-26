import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { dbConfig } from "../../database-config"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate required fields
    const missingFields = []
    if (!name || name.trim() === "") missingFields.push("name")
    if (!email || email.trim() === "") missingFields.push("email")
    if (!password || password.trim() === "") missingFields.push("password")

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required field(s): ${missingFields.join(", ")}` },
        { status: 400 }
      )
    }

    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig)

    // Check if user already exists
    const [existingUsers]: any = await connection.execute("SELECT id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      await connection.end()
      return NextResponse.json({ message: "Email already in use" }, { status: 400 })
    }

    // Insert new user with 'member' role by default
    const [result]: any = await connection.execute(
      "INSERT INTO users (name, email, password, role, active, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, password, "member", 1, new Date()],
    )

    await connection.end()

    return NextResponse.json({
      message: "Registration successful",
      userId: result.insertId,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
