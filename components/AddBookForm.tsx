"use client"

import React, { useState, useEffect } from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select"

interface AddBookFormProps {
  onSuccess: () => void
  onCancel: () => void
  bookToEdit?: {
    id: number
    title: string
    author: string
    category: string
    isbn: string
    publication_year: number
    description: string
    cover_image: string
    content: string
    available: boolean
    stock: number
  }
}

export default function AddBookForm({ onSuccess, onCancel, bookToEdit }: AddBookFormProps) {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [isbn, setIsbn] = useState("")
  const [publicationYear, setPublicationYear] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [content, setContent] = useState("")
  const [available, setAvailable] = useState(true)
  const [stock, setStock] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Hardcoded categories for dropdown
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

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title)
      setAuthor(bookToEdit.author)
      setCategory(bookToEdit.category)
      setIsbn(bookToEdit.isbn)
      setPublicationYear(bookToEdit.publication_year.toString())
      setDescription(bookToEdit.description)
      setCoverImage(bookToEdit.cover_image)
      setContent(bookToEdit.content)
      setAvailable(bookToEdit.available)
      setStock(bookToEdit.stock || 0)
    }
  }, [bookToEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Normalize coverImage before submit
    let normalizedCoverImage = coverImage
    if (coverImage && !coverImage.startsWith("/uploads/") && !coverImage.startsWith("/")) {
      normalizedCoverImage = `/uploads/${coverImage}`
    }

    // Normalize content before submit
    let normalizedContent = content
    if (content && !content.startsWith("/content/") && !content.startsWith("/")) {
      normalizedContent = `/content/${content}`
    }

    try {
      const method = bookToEdit ? "PUT" : "POST"
      const url = bookToEdit ? `/api/admin/books/${bookToEdit.id}` : "/api/admin/books"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          category,
          isbn,
          publication_year: publicationYear,
          description,
          cover_image: normalizedCoverImage,
          content: normalizedContent,
          available,
          stock: Number(stock),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || (bookToEdit ? "Failed to update book" : "Failed to add book"))
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold mb-4">{bookToEdit ? "Edit Book" : "Add New Book"}</h2>

        {error && <p className="text-red-600">{error}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {/* Category dropdown */}
        <Select value={category} onValueChange={(value) => setCategory(value)} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Publication Year"
          value={publicationYear}
          onChange={(e) => setPublicationYear(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Content URL"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
          min={0}
          required
        />
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="form-checkbox"
          />
          <span>Available</span>
        </label>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? (bookToEdit ? "Updating..." : "Adding...") : (bookToEdit ? "Update Book" : "Add Book")}
          </button>
        </div>
      </form>
    </div>
  )
}
