import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import {BookOpen} from "lucide-react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Digital Library",
  description: "A digital library management system",
  generator: "waan",
  icons: {
    icon: "/uploads/bookopen.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <script 
          src="https://app.sandbox.midtrans.com/snap/snap.js" 
          data-client-key={process.env.MIDTRANS_CLIENT_KEY}
        ></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

