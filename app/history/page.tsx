"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, Clock, AlertTriangle, BookOpen, Calendar, ChevronRight } from "lucide-react"
import MemberNavbar from "@/components/member-navbar"

interface BorrowingHistory {
  id: number
  book_id: number
  book_title: string
  book_author: string
  borrow_date: string
  due_date: string
  return_date: string | null
  status: "active" | "overdue" | "returned"
}

export default function HistoryPage() {
  const [borrowings, setBorrowings] = useState<BorrowingHistory[]>([])
  const [filteredBorrowings, setFilteredBorrowings] = useState<BorrowingHistory[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchBorrowingHistory = async () => {
      try {
        const response = await fetch("/api/books/history")

        if (!response.ok) {
          throw new Error("Failed to fetch borrowing history")
        }

        const data = await response.json()
        setBorrowings(data)
        setFilteredBorrowings(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrowingHistory()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBorrowings(borrowings)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = borrowings.filter(
      (borrowing) =>
        borrowing.book_title.toLowerCase().includes(query) || borrowing.book_author.toLowerCase().includes(query),
    )

    setFilteredBorrowings(filtered)
  }, [searchQuery, borrowings])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString()
  }

  const viewBookDetails = (bookId: number) => {
    router.push(`/books/${bookId}`)
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <MemberNavbar />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8 bg-emerald-600 rounded-lg p-6 shadow-lg text-white">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Borrowing History</h1>
          <p className="text-emerald-100 text-lg">View your complete borrowing history from the library</p>
        </div>

        <div className="relative mb-6">
          <div className="bg-white rounded-full shadow-md flex items-center p-1 pl-4">
            <Search className="h-5 w-5 text-emerald-600 mr-2" />
            <Input
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
              placeholder="Search by book title or author..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading your borrowing history...</p>
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
        ) : borrowings.length === 0 ? (
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <CardTitle className="text-center text-xl text-gray-700">No Borrowing History</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <Clock className="h-12 w-12 text-emerald-600" />
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
                Borrowing History ({filteredBorrowings.length})
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Book</TableHead>
                    <TableHead className="font-semibold text-gray-700">Borrowed On</TableHead>
                    <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Returned On</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBorrowings.map((borrowing) => (
                    <TableRow key={borrowing.id} className="hover:bg-gray-50/50 group">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-gray-100 flex items-center justify-center overflow-hidden rounded shadow">
                            <BookOpen className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">{borrowing.book_title}</div>
                            <div className="text-sm text-gray-500">{borrowing.book_author}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(borrowing.borrow_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(borrowing.due_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {borrowing.return_date ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{formatDate(borrowing.return_date)}</span>
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {borrowing.status === "active" ? (
                          <Badge className="bg-blue-500 text-white px-3 py-1 font-medium rounded-full text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : borrowing.status === "overdue" ? (
                          <Badge className="bg-red-500 text-white px-3 py-1 font-medium rounded-full text-xs flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Overdue
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500 text-white px-3 py-1 font-medium rounded-full text-xs flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Returned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full flex items-center gap-1"
                          onClick={() => viewBookDetails(borrowing.book_id)}
                        >
                          View Book
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}