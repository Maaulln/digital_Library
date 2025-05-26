"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import MemberNavbar from "@/components/member-navbar"

export default function BookContentPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [content, setContent] = useState<string | null>(null)
  const [contentType, setContentType] = useState<"pdf" | "txt" | "raw" | "loading">("loading")
  const [error, setError] = useState<string | null>(null)
  const [borrowed, setBorrowed] = useState<boolean | null>(null)

  useEffect(() => {
    const checkBorrowedAndFetchContent = async () => {
      try {
        // Check if user has borrowed the book
        const borrowResponse = await fetch(`/api/books/borrowed/${bookId}`)
        if (!borrowResponse.ok) {
          setBorrowed(false)
          return
        }
        const borrowData = await borrowResponse.json()
        if (!borrowData.borrowed) {
          setBorrowed(false)
          return
        }
        setBorrowed(true)

        // Fetch book content
        const response = await fetch(`/api/books/${bookId}`)
        if (!response.ok) throw new Error("Failed to fetch book details")
        const data = await response.json()
        if (!data.content) {
          setContentType("raw")
          setContent("No content available for this book.")
          return
        }
        const contentValue = data.content as string

        if (contentValue.toLowerCase().endsWith(".pdf")) {
          setContentType("pdf")
          setContent(contentValue)
          return
        }

        if (contentValue.toLowerCase().endsWith(".txt")) {
          setContentType("txt")
          try {
            const contentResponse = await fetch(`/api/content/${contentValue}`)
            if (!contentResponse.ok) {
              throw new Error(`Failed to load content file (${contentResponse.status})`)
            }
            const text = await contentResponse.text()
            setContent(text)
          } catch (err: any) {
            setError(`Failed to load content file: ${err.message}`)
          }
          return
        }

        setContentType("raw")
        setContent(contentValue)
      } catch (err: any) {
        setError(err.message)
      }
    }

    if (bookId) checkBorrowedAndFetchContent()
  }, [bookId])

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MemberNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
          <Button variant="ghost" onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </main>
      </div>
    )
  }

  if (borrowed === false) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MemberNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <p className="text-yellow-700">Access denied. You must borrow this book to view its content.</p>
          </div>
          <Button variant="ghost" onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </main>
      </div>
    )
  }

  if (contentType === "loading" || borrowed === null) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MemberNavbar />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center h-64">
          <p className="text-slate-600 animate-pulse">Loading book content...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MemberNavbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center gap-2 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Book Details</span>
        </Button>

        {contentType === "pdf" && content && (
          <div>
            <h1 className="text-2xl font-semibold mb-4">Book Content (PDF)</h1>
            <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm">
              <iframe
                src={`/api/content/${content}`}
                className="w-full h-[600px] border-0"
                title="Book Content PDF"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href={`/api/content/${content}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                Open PDF in new tab
              </a>
            </div>
          </div>
        )}

        {(contentType === "txt" || contentType === "raw") && (
          <div>
            <h1 className="text-2xl font-semibold mb-4">Book Content</h1>
            <Card className="p-4 rounded-md border border-slate-200 max-h-[600px] overflow-y-auto shadow-sm whitespace-pre-wrap font-normal text-slate-800">
              {content}
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
