import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  try {
    const { filename } = params

    // Prevent directory traversal attacks
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    // Construct the full path to the file in public/content
    const filePath = path.join(process.cwd(), 'public', 'content', filename)

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read the file content
    const fileBuffer = await fs.readFile(filePath)

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'application/octet-stream'
    if (ext === '.pdf') {
      contentType = 'application/pdf'
    } else if (ext === '.txt') {
      contentType = 'text/plain'
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg'
    } else if (ext === '.png') {
      contentType = 'image/png'
    } else if (ext === '.svg') {
      contentType = 'image/svg+xml'
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
