'use client'

import React, { useState, useEffect } from 'react'
import { store } from '@/lib/store'
import type { User } from '@/lib/store'
import Link from 'next/link'
import { useActiveUser } from '@/lib/activeUserStore'
import { getTheme } from '@/lib/theme'
import UserLink from '@/components/UserLink'
import GlowButton from '@/components/GlowButton'

export default function ProfilesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const activeUser = useActiveUser(state => state.user)
  const theme = getTheme(activeUser?.role || 'STUDENT')

  useEffect(() => {
    const allUsers = store.getAllUsers()
    setUsers(allUsers.filter(user => user.role === 'STUDENT'))
  }, [])

  const filteredUsers = selectedClass === 'all' 
    ? users 
    : users.filter(user => user.class === selectedClass)

  // Get unique classes for the filter
  const classes = ['all', ...Array.from(new Set(users.map(user => user.class || '').filter(Boolean)))]

  if (!activeUser) {
    return (
      <div className={`min-h-screen bg-[${theme.background}] text-[${theme.textPrimary}] py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative group/title inline-block">
            <h2 className={`text-2xl font-bold text-[${theme.textPrimary}] relative z-10 group-hover/title:tracking-wider transition-all duration-500`}>
              Sign in required
            </h2>
            <div className={`absolute -inset-x-6 -inset-y-4 bg-[${theme.primary}]/20 blur-xl group-hover/title:bg-[${theme.primary}]/30 transition-all duration-500`} />
          </div>
          <p className={`mt-2 text-[${theme.textSecondary}]`}>
            Please sign in to view and rate profiles
          </p>
          <Link
            href="/signin"
            className={`mt-4 inline-block px-6 py-3 rounded-lg text-[${theme.textPrimary}] bg-[${theme.background}] hover:bg-[${theme.backgroundHover}] border border-[${theme.border}] transition-all duration-200`}
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[${theme.background}] text-[${theme.textPrimary}] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="relative group/title inline-block">
            <h1 className={`text-4xl font-bold text-[${theme.textPrimary}] relative z-10 group-hover/title:tracking-wider transition-all duration-500`}>
              Subject Database
            </h1>
            <div className={`absolute -inset-x-6 -inset-y-4 bg-[${theme.primary}]/20 blur-xl group-hover/title:bg-[${theme.primary}]/30 transition-all duration-500`} />
          </div>
          <p className={`mt-2 text-[${theme.textSecondary}]`}>
            {activeUser.role === 'TEACHER' ? 'Access and evaluate subject profiles' : 'View and rate other users in the system'}
          </p>
        </div>

        {/* Class Filter */}
        <div className="flex gap-4 mb-8">
          {classes.map((className) => (
            <GlowButton
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`${
                selectedClass === className 
                  ? `bg-[${theme.primary}]/20 border-[${theme.primary}]/40 text-[${theme.primary}] shadow-[0_0_15px_rgba(66,255,0,0.3)]` 
                  : `bg-black/50 border-[${theme.primary}]/20 hover:border-[${theme.primary}]/40`
              }`}
            >
              {className === 'all' ? 'All Classes' : className}
            </GlowButton>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-[${theme.background}] shadow-2xl rounded-xl overflow-hidden border border-[${theme.border}] backdrop-blur-sm relative group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMi41IiBoZWlnaHQ9IjIuNSIgeD0iMCIgeT0iMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTSAwIDAgTCAyIDAgTCAyIDIgTCAwIDIiIGZpbGw9IiMxMTExMTEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcCkiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay pointer-events-none" />
              
              <div className="relative z-10 p-6">
                <div className="flex flex-col items-center text-center">
                  {user.image && (
                    <div className="relative mb-4">
                      <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/10 to-transparent rounded-full transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <img
                        src={user.image}
                        alt={user.name}
                        className={`w-24 h-24 rounded-full border-2 border-[${theme.border}] shadow-xl`}
                      />
                    </div>
                  )}
                  
                  <div className="relative group/name">
                    <Link
                      href={`/profile/${user.id}`}
                      className={`text-xl font-bold text-[${theme.textPrimary}] relative z-10 group-hover/name:tracking-wider transition-all duration-500 hover:text-[${theme.primary}]`}
                    >
                      {user.name}
                    </Link>
                    <div className={`absolute -inset-x-4 -inset-y-2 bg-[${theme.primary}]/20 blur-lg opacity-0 group-hover/name:opacity-100 transition-opacity duration-500`} />
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2 justify-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-mono bg-[${theme.primary}]/5 text-[${theme.textPrimary}] border border-[${theme.border}]`}>
                      {user.role}
                    </span>
                    {user.class && (
                      <span className={`px-3 py-1 rounded-full text-sm font-mono bg-[${theme.primary}]/5 text-[${theme.textSecondary}] border border-[${theme.border}]`}>
                        {user.class}
                      </span>
                    )}
                  </div>
                  
                  {user.bio && (
                    <p className={`mt-4 text-sm text-[${theme.textSecondary}] line-clamp-2 leading-relaxed`}>
                      {user.bio}
                    </p>
                  )}

                  <div className="mt-6 flex space-x-4">
                    <Link
                      href={`/profile/${user.id}`}
                      className={`px-4 py-2 rounded text-sm font-medium bg-[${theme.background}] text-[${theme.textPrimary}] hover:bg-[${theme.backgroundHover}] border border-[${theme.border}] hover:border-[${theme.borderHover}] hover:text-[${theme.primary}] transition-all`}
                    >
                      View profile
                    </Link>
                    {user.id !== activeUser.id && (
                      <Link
                        href={`/profile/${user.id}#rate`}
                        className={`px-4 py-2 rounded text-sm font-medium bg-[${theme.background}] text-[${theme.textPrimary}] hover:bg-[${theme.backgroundHover}] border border-[${theme.border}] hover:border-[${theme.borderHover}] hover:text-[${theme.primary}] transition-all`}
                      >
                        {activeUser.role === 'TEACHER' ? 'Rate subject' : 'Rate student'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 