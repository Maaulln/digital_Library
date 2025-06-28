"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, User, Menu, X, BookMarked, Clock, LogOut } from "lucide-react"

export default function MemberNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center group">
              <BookOpen className="h-6 w-6 text-emerald-600 mr-2 group-hover:text-emerald-700 transition-colors" />
              <span className="font-bold text-xl group-hover:text-emerald-600 transition-colors">Digital Library</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/dashboard" className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-all">
              Dashboard
            </Link>
            <Link href="/my-books" className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-all">
              My Books
            </Link>
            <Link href="/history" className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-all">
              Borrowing History
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-2 hover:bg-gray-100">
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center">
                  <Link href="/profile" className="w-full flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600 focus:text-red-700">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:bg-gray-100">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-inner">
          <div className="container mx-auto px-4 py-2 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-700 hover:text-emerald-600 hover:bg-gray-50 px-3 py-2.5 rounded-md text-base font-medium transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Browse Books
            </Link>
            <Link
              href="/my-books"
              className="flex items-center text-gray-700 hover:text-emerald-600 hover:bg-gray-50 px-3 py-2.5 rounded-md text-base font-medium transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookMarked className="h-5 w-5 mr-3" />
              My Books
            </Link>
            <Link
              href="/history"
              className="flex items-center text-gray-700 hover:text-emerald-600 hover:bg-gray-50 px-3 py-2.5 rounded-md text-base font-medium transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <Clock className="h-5 w-5 mr-3" />
              Borrowing History
            </Link>
            <Link
              href="/profile"
              className="flex items-center text-gray-700 hover:text-emerald-600 hover:bg-gray-50 px-3 py-2.5 rounded-md text-base font-medium transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5 mr-3" />
              Profile
            </Link>
            <div className="pt-2 pb-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2.5 rounded-md text-base font-medium transition-all"
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}