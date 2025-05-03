'use client'

import React from 'react'
import Navbar from "./Navbar"
import Background from "./Background"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Background>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </Background>
  )
} 