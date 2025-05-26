"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, CheckCircle } from "lucide-react"

interface Borrowing {
  id: number
  book_title: string
  user_name: string
  borrow_date: string
  due_date: string
  return_date: string | null
  status: "active" | "overdue" | "returned"
}

export default function BorrowingTable() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [filteredBorrowings, setFilteredBorrowings] = useState<Borrowing[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const response = await fetch("/api/admin/borrowings")

        if (!response.ok) {
          throw new Error("Failed to fetch borrowings")
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

    fetchBorrowings()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBorrowings(borrowings)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = borrowings.filter(
      (borrowing) =>
        borrowing.book_title.toLowerCase().includes(query) ||
        borrowing.user_name.toLowerCase().includes(query) ||
        borrowing.status.toLowerCase().includes(query),
    )

    setFilteredBorrowings(filtered)
  }, [searchQuery, borrowings])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleReturn = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/borrowings/${id}/return`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Failed to return book")
      }

      // Update the borrowing status in the state
      const updatedBorrowings = borrowings.map((borrowing) =>
        borrowing.id === id
          ? {
              ...borrowing,
              status: "returned" as const,
              return_date: new Date().toISOString(),
            }
          : borrowing,
      )
      setBorrowings(updatedBorrowings)
      setFilteredBorrowings(
        filteredBorrowings.map((borrowing) =>
          borrowing.id === id
            ? {
                ...borrowing,
                status: "returned" as const,
                return_date: new Date().toISOString(),
              }
            : borrowing,
        ),
      )
    } catch (error) {
      console.error("Error returning book:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input className="pl-10" placeholder="Search borrowings..." value={searchQuery} onChange={handleSearch} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading borrowings...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredBorrowings.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No borrowings found matching your search.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Borrowed By</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBorrowings.map((borrowing) => (
                <TableRow key={borrowing.id}>
                  <TableCell className="font-medium">{borrowing.book_title}</TableCell>
                  <TableCell>{borrowing.user_name}</TableCell>
                  <TableCell>{formatDate(borrowing.borrow_date)}</TableCell>
                  <TableCell>{formatDate(borrowing.due_date)}</TableCell>
                  <TableCell>{borrowing.return_date ? formatDate(borrowing.return_date) : "-"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        borrowing.status === "active"
                          ? "bg-blue-500"
                          : borrowing.status === "overdue"
                            ? "bg-red-500"
                            : "bg-green-500"
                      }
                    >
                      {borrowing.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {borrowing.status !== "returned" && (
                          <DropdownMenuItem onClick={() => handleReturn(borrowing.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Returned
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
