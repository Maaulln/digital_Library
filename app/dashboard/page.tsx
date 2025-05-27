"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Book, BookOpen, ArrowRight, BookmarkPlus, TrendingUp} from "lucide-react"
import MemberNavbar from "@/components/member-navbar"
import BookCard from "@/components/book-card"
import Link from "next/link"
import RecommendationBooks from "@/components/ui/recommendation-books"
import LiveClock from "@/components/ui/LiveClock"
import Footer from "@/components/ui/footer"

interface Book {
  id: number
  title: string
  author: string
  category: string
  available: boolean
  cover_image: string
}

export default function MemberDashboard() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books")

        if (!response.ok) {
          throw new Error("Failed to fetch books")
        }

        const data = await response.json()
        console.log("Fetched books data:", data)
        setBooks(data)
        setFilteredBooks(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
    )

    setFilteredBooks(filtered)
  }, [searchQuery, books])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const categories = [
    "Fiction",
    "Non-fiction",
    "Science",
    "History",
    "Biography",
    "Fantasy",
    "Mystery",
    "Romance",
  ]

  const recommendedBooks = books.slice(0, 4).map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    coverUrl: book.cover_image,
    available: book.available,
    category: book.category,
  }))
  console.log("Recommended books array:", recommendedBooks)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Responsive navbar adjustment */}
      <div className="relative z-50">
        <MemberNavbar />
      </div>

      {/* Hero Section - Responsive & Engaging */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-28">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-8 md:mb-0 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-100">Great Read</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-emerald-100 max-w-xl">
                Explore our vast collection of carefully curated books. Embark on adventures, gain knowledge, and fuel your imagination.
              </p>
              <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
                <Link href="/books" className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-emerald-600 rounded-full font-medium hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base">
                  Browse Catalog
                </Link>
                <Link href="/history" className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-700 text-white rounded-full font-medium hover:bg-emerald-800 transition-all border border-emerald-400 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base">
                  My Reading List
                </Link>
              </div>
            </div>
            <div className="hidden lg:block -mr-10 relative">
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-teal-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative z-10 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-2xl rotate-3 transform hover:rotate-0 transition-all duration-500">
                <div className="flex space-x-4">
                  <div className="w-32 h-44 bg-gradient-to-b from-emerald-200 to-teal-100 rounded-lg shadow-inner flex items-center justify-center">
                    <Book className="h-16 w-16 text-emerald-600 opacity-80" />
                  </div>
                  <div className="w-32 h-44 bg-gradient-to-b from-green-200 to-emerald-100 rounded-lg shadow-inner flex items-center justify-center rotate-6">
                    <BookOpen className="h-16 w-16 text-green-600 opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative wave divider */}
        <div className="h-12 sm:h-16 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 relative">
          <svg className="absolute bottom-0 w-full h-12 sm:h-16" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 C240,60 480,70 720,40 C960,10 1200,30 1440,70 L1440,74 L0,74 Z" fill="white"/>
          </svg>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 -mt-6 relative z-10">
        {/* Stats Banner - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="p-2 sm:p-3 rounded-full bg-emerald-100 text-emerald-600">
              <BookmarkPlus className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Available Books</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{books.length}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="p-2 sm:p-3 rounded-full bg-amber-100 text-amber-600">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Categories</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{categories.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all hover:shadow-lg hover:-translate-y-1 sm:col-span-2 md:col-span-1">
            <div className="flex flex-col">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Current Time</p>
              <LiveClock />
            </div>
          </div>
        </div>

{/* Combined Search & Books Section - Integrated Design */}
<div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-2xl mb-8 sm:mb-12">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 md:mb-0">
      {searchQuery ? `Results for "${searchQuery}"` : "Find & Explore Books"}
      {filteredBooks.length > 0 && (
        <span className="ml-2 sm:ml-3 text-xs sm:text-sm bg-emerald-100 text-emerald-800 py-1 px-2 sm:px-3 rounded-full">
          {filteredBooks.length}
        </span>
      )}
    </h2>
    <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
      Showing {filteredBooks.length} of {books.length} books
    </span>
  </div>
  
  <div className="relative mb-6 group">
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300"></div>
    <div className="relative flex items-center">
      <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
      <Input
        className="pl-10 sm:pl-12 py-4 sm:py-6 border-2 border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-base sm:text-lg w-full"
        placeholder="Search by title, author, or category..."
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  </div>

  <div className="mb-6 sm:mb-8">
    <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4 flex items-center">
      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-emerald-600" />
      Browse by Category
    </h3>
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Badge
        className={`cursor-pointer px-3 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm ${
          searchQuery === ""
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
        }`}
        onClick={() => setSearchQuery("")}
      >
        All Books
      </Badge>

      {categories.map((category) => (
        <Badge
          key={category}
          className={`cursor-pointer px-3 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm ${
            searchQuery === category
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
          onClick={() => setSearchQuery(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
      ))}
    </div>
  </div>

  {/* Divider with gradient */}
  <div className="relative h-px w-full mb-6 sm:mb-8">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
  </div>

  {/* Book Results Section */}
  {isLoading ? (
    <div className="flex justify-center items-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-t-2 border-emerald-600 mx-auto mb-4 sm:mb-6"></div>
        <p className="text-gray-600 text-base sm:text-lg">Preparing your literary adventure...</p>
      </div>
    </div>
  ) : error ? (
    <div className="flex justify-center items-center py-12">
      <div className="text-center">
        <div className="rounded-full bg-red-100 p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <span className="text-red-500 text-2xl sm:text-3xl">!</span>
        </div>
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3">Oops! Something went wrong</h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button className="px-4 sm:px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all text-sm sm:text-base">
          Try again
        </button>
      </div>
    </div>
  ) : filteredBooks.length === 0 ? (
    <div className="flex justify-center items-center py-12">
      <div className="text-center">
        <div className="rounded-full bg-gray-100 p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3">No books found</h3>
        <p className="text-gray-600 mb-4 sm:mb-6">We couldn't find any books matching your search criteria.</p>
        <button
          className="px-4 sm:px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all flex items-center mx-auto text-sm sm:text-base"
          onClick={() => setSearchQuery("")}
        >
          View all books <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {filteredBooks.map((book) => (
          <div key={book.id} className="transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <BookCard book={book} />
          </div>
        ))}
      </div>
      
      {/* Pagination - Optional addition */}
      {filteredBooks.length > 12 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium">1</button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium">2</button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium">3</button>
            <span className="px-2 text-gray-500">...</span>
            <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )}
</div>

        {/* Recommendation Books with responsive styling */}
<div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-2xl mb-8 sm:mb-12">
          {/* The RecommendationBooks component should be updated separately to be responsive */}
          <RecommendationBooks />
        </div>

      </main>
      
      {/* Footer - Responsive */}
      <Footer />
    </div>
  )
}