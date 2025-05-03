import type { Metadata } from "next"
import { Inter } from "next/font/google"
import React from 'react'
import "./globals.css"
import ClientLayout from "../components/ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CAS - Conformity Assessment System",
  description: "A social rating platform for educational purposes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
} 