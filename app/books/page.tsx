"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import BookCard from "@/components/book-card";
import MemberNavbar from "@/components/member-navbar"; // Import Navbar

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  available: boolean;
  cover_image: string;
  stock: number;
}

export default function BooksCatalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const categories = [
    "Fiction",
    "Non-fiction",
    "Science",
    "History",
    "Biography",
    "Fantasy",
    "Mystery",
    "Romance",
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
    );

    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <MemberNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Books Catalog</h1>

        {/* Search Bar */}
        <div className="mb-6 relative group">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-12 py-6 border-2 border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
              placeholder="Search by title, author, or category..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Badge
            className={`cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all ${
              searchQuery === ""
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSearchQuery("")}
          >
            All Books
          </Badge>

          {categories.map((category) => (
            <Badge
              key={category}
              className={`cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all ${
                searchQuery === category
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSearchQuery(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-emerald-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center text-gray-500">No books found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="transform transition-all hover:-translate-y-2 hover:shadow-xl"
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
