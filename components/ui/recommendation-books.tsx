"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Info, Heart, BookMarked, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Book {
  id?: string | number
  title: string
  author: string
  cover_image?: string
  category?: string
  available?: boolean
}

interface RecommendationBooksProps {}

export const RecommendationBooks: React.FC<RecommendationBooksProps> = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loadingBookId, setLoadingBookId] = useState<string | number | null>(null)
  const [savedBooks, setSavedBooks] = useState<Set<string | number>>(new Set())
  const router = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        const response = await fetch("/api/books/recommendations")
        if (!response.ok) {
          throw new Error("Failed to fetch recommended books")
        }
        const data: Book[] = await response.json()
        // Filter out borrowed books (available: false)
        const filteredBooks = data.filter(book => book.available !== false)
        setBooks(filteredBooks)
      } catch (error: any) {
        console.error("Error fetching recommended books:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to load recommended books.",
          variant: "destructive",
        })
      }
    }
    fetchRecommendedBooks()
  }, [toast])

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-lg border border-gray-200 bg-gray-50 text-center space-y-3">
        <BookOpen className="h-12 w-12 text-gray-400" />
        <div>
          <p className="text-lg font-medium text-gray-700">No recommendations yet</p>
          <p className="text-sm text-gray-500">Check back later for personalized book recommendations.</p>
        </div>
      </div>
    )
  }

  const handleSaveBook = (bookId: string | number) => {
    const newSavedBooks = new Set(savedBooks)
    
    if (savedBooks.has(bookId)) {
      newSavedBooks.delete(bookId)
      toast({
        title: "Book removed",
        description: "This book has been removed from your saved collection.",
      })
    } else {
      newSavedBooks.add(bookId)
      toast({
        title: "Book saved",
        description: "This book has been added to your saved collection.",
      })
    }
    
    setSavedBooks(newSavedBooks)
  }

  const handleBorrow = async (book: Book) => {
    const bookId = book.id ?? book.title
    
    if (!book.available) return
    
    setLoadingBookId(bookId)

    try {
      const response = await fetch("/api/books/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to borrow book")
      }

      setBooks(books.map(b => {
        const bId = b.id ?? b.title
        return bId === bookId ? { ...b, available: false } : b
      }))

      toast({
        title: "Success!",
        description: "Book borrowed successfully.",
      })

      router.refresh()
    } catch (error: any) {
      console.error("Error borrowing book:", error)
      
      toast({
        title: "Error",
        description: error.message || "Failed to borrow book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingBookId(null)
    }
  }

  const viewDetails = (bookId: string | number) => {
    router.push(`/books/${bookId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.slice(0, 4).map((book) => {
          const bookId = book.id ?? book.title
          const isAvailable = book.available !== false
          const isLoading = loadingBookId === bookId
          const isSaved = savedBooks.has(bookId)
          
          return (
            <Card 
              key={bookId} 
              className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2"
            >
              <div className="relative pt-4 px-4 pb-0">
                <div className="flex justify-center mb-2">
                  {book.cover_image ? (
                    <img 
                      src={book.cover_image.startsWith("/uploads/") ? book.cover_image : `/uploads/${book.cover_image}`} 
                      alt={book.title}
                      className="h-48 object-contain rounded-md"
                    />
                  ) : (
                    <div className="h-48 w-36 bg-slate-100 rounded-md flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                </div>
                
                <Badge 
                  className="absolute top-3 right-3" 
                  variant={isAvailable ? "default" : "secondary"}
                >
                  {isAvailable ? "Available" : "Borrowed"}
                </Badge>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveBook(bookId);
                  }}
                  className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
                >
                  <Heart 
                    className={`h-5 w-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-600'} transition-colors`} 
                  />
                </button>
              </div>
              
              <CardContent className="flex-grow pt-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{book.author}</p>
                {book.category && (
                  <Badge variant="outline" className="bg-slate-50">
                    {book.category}
                  </Badge>
                )}
              </CardContent>

              <CardFooter className="pt-0 pb-4 px-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => viewDetails(bookId)}
                >
                  <Info className="h-4 w-4 mr-1" />
                  Details
                </Button>
                
                <Button
                  variant={isAvailable ? "default" : "secondary"}
                  size="sm"
                  className="flex-1"
                  disabled={!isAvailable || isLoading}
                  onClick={() => handleBorrow(book)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Processing...
                    </>
                  ) : isAvailable ? "Borrow" : "Unavailable"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default RecommendationBooks