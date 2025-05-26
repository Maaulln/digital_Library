"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, ArrowLeft, BookMarked, Calendar, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import MemberNavbar from "@/components/member-navbar"

interface Book {
  id: number
  title: string
  author: string
  category: string
  isbn: string
  publication_year: number
  description: string
  cover_image: string
  available: boolean
}

export default function BookDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const bookId = params.id as string
  
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [borrowing, setBorrowing] = useState(false)

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}`)
        if (!response.ok) throw new Error("Failed to fetch book details")
        const data = await response.json()
        setBook(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (bookId) fetchBookDetails()
  }, [bookId])

  const handleBorrow = async () => {
    if (!book) return

    setBorrowing(true)
    try {
      const response = await fetch("/api/books/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to borrow book")
      }

      setBook({ ...book, available: false })
      
      toast({
        title: "Success!",
        description: "Book borrowed successfully. Due date: " + new Date(data.dueDate).toLocaleDateString(),
      })

      setTimeout(() => router.push("/my-books"), 2000)
    } catch (error: any) {
      console.error("Error borrowing book:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to borrow book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBorrowing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="relative z-50">
          <MemberNavbar />
        </div>
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-slate-600 animate-pulse">Loading book details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MemberNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500 font-medium">{error || "Book not found"}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MemberNavbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2 hover:bg-slate-100 transition-colors" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-4">
            <Card className="overflow-hidden border-0 shadow-md h-full">
              <div className="aspect-[2/3] relative bg-slate-100">
                {book.cover_image ? (
                  <img
                    src={(book.cover_image.startsWith("http") || book.cover_image.startsWith("/")) 
                      ? book.cover_image 
                      : `/uploads/${book.cover_image}`}
                    alt={book.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <BookOpen className="h-24 w-24 text-slate-400" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Book Details */}
          <div className="md:col-span-8">
            <Card className="border-0 shadow-md h-full">
              <CardContent className="p-6">
                <div className="mb-6">
                  <Badge className="mb-3 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">{book.category}</Badge>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{book.title}</h1>
                  <p className="text-xl text-slate-600">by {book.author}</p>
                </div>

                <Separator className="my-6 bg-slate-200" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-md">
                      <BookMarked className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">ISBN</p>
                      <p className="font-medium text-slate-800">{book.isbn}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-md">
                      <Calendar className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Published</p>
                      <p className="font-medium text-slate-800">{book.publication_year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-md">
                      <User className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p className={`font-medium ${book.available ? "text-emerald-600" : "text-amber-600"}`}>
                        {book.available ? "Available" : "Borrowed"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 text-slate-800">Description</h2>
                  <div className="bg-slate-50 p-4 rounded-md mb-6 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                      {book.description || "No description available for this book."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Borrow button at the bottom, full width */}
        <div className="mt-6">
          <Button
            className={`w-full font-medium shadow-sm transition-all py-3 text-base ${
              book.available 
                ? "bg-emerald-600 hover:bg-emerald-700" 
                : "bg-slate-400"
            }`}
            disabled={!book.available || borrowing}
            onClick={handleBorrow}
          >
            {borrowing 
              ? "Processing..." 
              : book.available 
                ? "Borrow Book" 
                : "Currently Unavailable"}
          </Button>
        </div>
      </main>
    </div>
  )
}