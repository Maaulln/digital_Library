"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookOpen, AlertTriangle, ChevronRight, Calendar, Clock } from "lucide-react"
import MemberNavbar from "@/components/member-navbar"
import PaymentButton from "@/components/payment-button"

interface BorrowedBook {
  id: number
  book_id: number
  book_title: string
  book_author: string
  borrow_date: string
  due_date: string
  status: "active" | "overdue" | string
  cover_image: string
}

export default function MyBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch("/api/books/borrowed")

        if (!response.ok) {
          throw new Error("Failed to fetch borrowed books")
        }

        const data = await response.json()
        setBorrowedBooks(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrowedBooks()
  }, [])

  const handleReturn = async (bookId: number) => {
    try {
      const response = await fetch("/api/books/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId }),
      })

      if (!response.ok) {
        throw new Error("Failed to return book")
      }

      // Remove the returned book from the list
      setBorrowedBooks(borrowedBooks.filter((book) => book.book_id !== bookId))
    } catch (error) {
      console.error("Error returning book:", error)
    }
  }

  const formatDate = (dateString: string) => {
    // Format tanggal dan waktu menggunakan format 24 jam
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return new Date(dateString).toLocaleString(undefined, options);
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset waktu ke 00:00:00
    
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0) // Reset waktu ke 00:00:00
    
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const viewBookDetails = (bookId: number) => {
    router.push(`/books/${bookId}`)
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <MemberNavbar />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8 bg-emerald-600 rounded-lg p-6 shadow-lg text-white">
          <h1 className="text-4xl font-bold tracking-tight mb-2">My Books</h1>
          <p className="text-emerald-100 text-lg">Track and manage your borrowed books</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading your books...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="border-red-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle className="h-8 w-8" />
                <p className="font-medium text-lg">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : borrowedBooks.length === 0 ? (
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <CardTitle className="text-center text-xl text-gray-700">No Books Borrowed</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <BookOpen className="h-12 w-12 text-emerald-600" />
              </div>
              <p className="text-center text-gray-600 mb-6 max-w-md">You haven't borrowed any books yet. Explore our collection and find something interesting to read.</p>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 px-8 py-6 rounded-full h-auto text-base font-medium flex items-center gap-2" 
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
                <ChevronRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden shadow-lg border-0">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <CardTitle className="text-xl text-gray-800">
                Currently Borrowed ({borrowedBooks.length})
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Book</TableHead>
                    <TableHead className="font-semibold text-gray-700">Borrowed On</TableHead>
                    <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowedBooks.map((book) => {
                    const daysRemaining = getDaysRemaining(book.due_date);
                    const isUrgent = daysRemaining <= 2 && daysRemaining > 0;
                    const daysOverdue = daysRemaining < 0 ? Math.abs(daysRemaining) : 0;
                    const fineAmount = daysOverdue > 5 ? (daysOverdue * 5000) : (daysOverdue * 2000);
                    
                    return (
                      <TableRow key={book.id} className="hover:bg-gray-50/50 group">
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-12 bg-gray-100 flex items-center justify-center overflow-hidden rounded shadow">
                              {book.cover_image ? (
                                <img
                                  src={book.cover_image ? `/uploads/${book.cover_image}` : "/placeholder.svg"}
                                  alt={book.book_title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <BookOpen className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">{book.book_title}</div>
                              <div className="text-sm text-gray-500">{book.book_author}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(book.borrow_date)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{formatDate(book.due_date)}</span>
                            </div>
                            {book.status === "active" && (
                              <span className={`text-xs mt-1 font-medium ${
                                book.status === "overdue" ? "text-red-500" : 
                                isUrgent ? "text-orange-500" : "text-gray-500"
                              }`}>
                                {daysRemaining > 0
                                  ? `${daysRemaining} days remaining`
                                  : "Due today"}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {book.status === "active" ? (
                            <Badge className="bg-blue-500 text-white px-3 py-1 font-medium rounded-full text-xs">Active</Badge>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex flex-col gap-1">
                                <Badge className="bg-red-500 text-white px-3 py-1 font-medium rounded-full text-xs flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Terlambat {daysOverdue} hari
                                </Badge>
                                <span className="text-xs text-red-600 font-medium">
                                  Denda: Rp{fineAmount.toLocaleString()}
                                </span>
                                <PaymentButton 
                                  user_id={1}
                                  borrowing_id={book.id} 
                                  amount={fineAmount}
                                  onSuccess={() => {
                                    window.location.reload();
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full"
                              onClick={() => viewBookDetails(book.book_id)}
                            >
                              Details
                            </Button>
                            {(book.status === "active" || book.status === "overdue") && (
                              <Button
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700 rounded-full"
                                onClick={() => router.push(`/books/${book.book_id}/content`)}
                              >
                                Read
                              </Button>
                            )}
                            {book.status === "active" && (
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
                                onClick={() => handleReturn(book.book_id)}
                              >
                                Return
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}