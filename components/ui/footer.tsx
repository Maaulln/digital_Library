import * as React from "react"
import {} from "lucide-react"

interface FooterProps {
  className?: string
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`bg-white border-t border-emerald-100 py-8 ${className ?? ""}`}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Digital Library
          </p>
        </div>
        
        <nav className="flex flex-wrap justify-center">
          <a href="#" className="mx-3 my-1 text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors">
            Privacy
          </a>
          <a href="#" className="mx-3 my-1 text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors">
            Terms
          </a>
          <a href="#" className="mx-3 my-1 text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors">
            Contact
          </a>
          <a href="#" className="mx-3 my-1 text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors">
            Support
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer