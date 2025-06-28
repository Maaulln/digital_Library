"use client"

import { useState, useEffect } from "react"
import AddBookForm from "@/components/AddBookForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, BookMarked, Clock } from "lucide-react"
import AdminNavbar from "@/components/admin-navbar"
import BookTable from "@/components/book-table"
import UserTable from "@/components/user-table"
import BorrowingTable from "@/components/borrowing-table"

interface Stats {
  totalBooks: number
  totalUsers: number
  activeLoans: number
  availableBooks: number
}
function CardStat({
  title,
  icon: Icon,
  value,
  description,
  isLoading,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  value: number
  description: string
  isLoading: boolean
}) {
  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-emerald-600" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold">{isLoading ? "..." : value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalUsers: 0,
    activeLoans: 0,
    availableBooks: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddBookForm, setShowAddBookForm] = useState(false)
  const [refreshBooks, setRefreshBooks] = useState(false)
  const [bookToEdit, setBookToEdit] = useState(undefined)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch statistics")
        }

        const data = await response.json()
        setStats(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [refreshBooks])

  const handleAddBookClick = () => {
    setBookToEdit(undefined)
    setShowAddBookForm(true)
  }

  const handleFormSuccess = () => {
    setShowAddBookForm(false)
    setBookToEdit(undefined)
    setRefreshBooks((prev) => !prev)
  }

  const handleFormCancel = () => {
    setShowAddBookForm(false)
    setBookToEdit(undefined)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your digital library system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CardStat
            title="Total Books"
            icon={BookOpen}
            value={stats.totalBooks}
            description="Books in the library"
            isLoading={isLoading}
          />
          <CardStat
            title="Available Books"
            icon={BookMarked}
            value={stats.availableBooks}
            description="Books available for borrowing"
            isLoading={isLoading}
          />
          <CardStat
            title="Active Loans"
            icon={Clock}
            value={stats.activeLoans}
            description="Books currently borrowed"
            isLoading={isLoading}
          />
          <CardStat
            title="Total Users"
            icon={Users}
            value={stats.totalUsers}
            description="Registered users"
            isLoading={isLoading}
          />
        </div>

        <Tabs defaultValue="books" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="borrowings">Borrowings</TabsTrigger>
          </TabsList>
          <TabsContent value="books">
            <div className="flex justify-end mb-4">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleAddBookClick}
              >
                Add New Book
              </Button>
            </div>
            <BookTable
              key={refreshBooks.toString()}
              onEditBook={(book: any) => {
                setBookToEdit(book)
                setShowAddBookForm(true)
              }}
            />
            {showAddBookForm && (
              <AddBookForm
                bookToEdit={bookToEdit}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}
          </TabsContent>
          <TabsContent value="users">
            <UserTable />
          </TabsContent>
          <TabsContent value="borrowings">
            <BorrowingTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
