"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  available: boolean;
  cover_image: string;
  stock: number;
}

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book: initialBook }: BookCardProps) {
  const [book, setBook] = useState(initialBook);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleBorrow = async () => {
    if (book.stock <= 0) return;
    setIsLoading(true);
    try {
      // Kirim request peminjaman
      const response = await fetch("/api/books/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book.id }),
      });

      // Parse response JSON
      const data = await response.json();

      // Cek status response
      if (!response.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      // Perbarui state lokal buku
      setBook({
        ...book,
        stock: book.stock - 1,
        available: book.stock - 1 > 0,
      });

      // Tampilkan notifikasi sukses
      toast({
        title: "Success!",
        description:
          "Book borrowed successfully. You can find it in 'My Books'.",
      });

      // Refresh halaman untuk memperbarui data dari server
      router.refresh();
    } catch (error: any) {
      console.error("Error borrowing book:", error);

      // Tampilkan notifikasi error
      toast({
        title: "Error",
        description:
          error.message || "Failed to borrow book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewDetails = () => {
    router.push(`/books/${book.id}`);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2">
      <div className="relative pt-4 px-4 pb-0">
        <div className="flex justify-center mb-2">
          {book.cover_image ? (
            <img
              src={
                book.cover_image.startsWith("/uploads/")
                  ? book.cover_image
                  : `/uploads/${book.cover_image}`
              }
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
          variant={book.available ? "default" : "secondary"}
        >
          {book.available ? "Available" : "Borrowed"}
        </Badge>
        <div className="absolute top-10 right-3 bg-gray-100 rounded-md px-2 py-1 text-xs font-semibold text-gray-700">
          Stock: {book.stock}
        </div>
      </div>

      <CardContent className="flex-grow pt-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-slate-500 mb-2">{book.author}</p>
        <Badge variant="outline" className="bg-slate-50">
          {book.category}
        </Badge>
      </CardContent>

      <CardFooter className="pt-0 pb-4 px-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={viewDetails}
        >
          <Info className="h-4 w-4 mr-1" />
          Details
        </Button>

        <Button
          variant={book.available ? "default" : "secondary"}
          size="sm"
          className="flex-1"
          disabled={!book.available || isLoading}
          onClick={handleBorrow}
        >
          {isLoading
            ? "Processing..."
            : book.available
            ? "Borrow"
            : "Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  );
}
