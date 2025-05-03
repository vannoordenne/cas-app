'use client'

import React from 'react'
import Link from 'next/link'
import { useActiveUser } from '@/lib/activeUserStore'
import { getTheme } from '@/lib/theme'

export default function Navbar() {
  const activeUser = useActiveUser(state => state.user)
  const setActiveUser = useActiveUser(state => state.setUser)
  const theme = getTheme(activeUser?.role || 'STUDENT')

  const handleLogout = () => {
    setActiveUser(null)
  }

  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-[#42ff00]/10 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#42ff00]/5 via-transparent to-[#42ff00]/5" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative z-10">
          <Link 
            href="/" 
            className="text-2xl font-bold relative group"
          >
            <span className="text-white relative">
              CAS<span className={`text-[${theme.primary}] animate-pulse`}>.</span>
            </span>
            <span className={`absolute -inset-x-2 inset-y-0 bg-[${theme.primary}]/20 blur-xl group-hover:bg-[${theme.primary}]/30 transition-all duration-500`} />
            <span className={`absolute -inset-x-2 inset-y-0 bg-[${theme.primary}]/10 blur animate-pulse`} />
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded text-sm font-medium text-[${theme.textSecondary}] hover:text-[${theme.primary}] relative group overflow-hidden`}
              >
                <span className="relative z-10">Home</span>
                <span className={`absolute inset-0 bg-gradient-to-r from-[${theme.primary}]/0 via-[${theme.primary}]/10 to-[${theme.primary}]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
                <span className={`absolute inset-0 bg-[${theme.primary}]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`} />
              </Link>
              <Link
                href="/leaderboard"
                className={`px-4 py-2 rounded text-sm font-medium text-[${theme.textSecondary}] hover:text-[${theme.primary}] relative group overflow-hidden`}
              >
                <span className="relative z-10">Leaderboard</span>
                <span className={`absolute inset-0 bg-gradient-to-r from-[${theme.primary}]/0 via-[${theme.primary}]/10 to-[${theme.primary}]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
                <span className={`absolute inset-0 bg-[${theme.primary}]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`} />
              </Link>
            </div>
            
            <div className="pl-4 border-l border-[#42ff00]/10">
              {activeUser ? (
                <Link 
                  href={`/profile/${activeUser.id}`}
                  className="flex items-center space-x-3 group"
                >
                  {activeUser.image && (
                    <img
                      src={activeUser.image}
                      alt={activeUser.name}
                      className={`w-8 h-8 rounded-full border border-[${theme.primary}]/20 group-hover:border-[${theme.primary}]/40 transition-colors`}
                    />
                  )}
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium text-[${theme.primary}] group-hover:text-[${theme.secondary}] transition-colors`}>
                      {activeUser.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                      className={`text-xs text-[${theme.textSecondary}] hover:text-[${theme.primary}] transition-colors`}
                    >
                      Logout
                    </button>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className={`px-4 py-2 rounded text-sm font-medium bg-[${theme.background}] text-[${theme.primary}] hover:bg-[${theme.backgroundHover}] border border-[${theme.border}] hover:border-[${theme.borderHover}] transition-all relative group overflow-hidden`}
                >
                  <span className="relative z-10">Sign In</span>
                  <span className={`absolute inset-0 bg-gradient-to-r from-[${theme.primary}]/0 via-[${theme.primary}]/10 to-[${theme.primary}]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
                  <span className={`absolute inset-0 bg-[${theme.primary}]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 