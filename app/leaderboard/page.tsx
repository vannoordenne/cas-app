'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { store } from '@/lib/store'
import { useActiveUser } from '@/lib/activeUserStore'
import { getTheme } from '@/lib/theme'
import UserLink from '@/components/UserLink'
import GlowButton from '@/components/GlowButton'

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const activeUser = useActiveUser(state => state.user)
  const theme = getTheme(activeUser?.role || 'STUDENT')

  useEffect(() => {
    const leaderboardUsers = store.getAllUsers()
      .filter(user => user.role === 'STUDENT')
      .map(user => {
        const receivedRatings = store.getRatingsByReceiverId(user.id)
        const averageRating = receivedRatings.length > 0
          ? receivedRatings.reduce((acc, rating) => acc + rating.stars, 0) / receivedRatings.length
          : 0
        return {
          ...user,
          receivedRatings,
          averageRating
        }
      })
      .sort((a, b) => b.averageRating - a.averageRating)

    setUsers(leaderboardUsers)
  }, [])

  const filteredUsers = selectedClass === 'all' 
    ? users 
    : users.filter(user => user.class === selectedClass)

  const isPassing = (rating: number) => rating >= 3.0

  // Get unique classes for the filter
  const classes = ['all', 'DT101', 'DT102', 'DT103']

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[${theme.primary}]`}></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="relative mb-8 group">
        <h1 className={`text-4xl font-bold text-[${theme.textPrimary}] relative z-10 group-hover:tracking-wider transition-all duration-500`}>
          Conformity Assessment Matrix
        </h1>
        <div className={`absolute -inset-x-6 -inset-y-4 bg-[${theme.primary}]/20 blur-xl group-hover:bg-[${theme.primary}]/30 transition-all duration-500`} />
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
      
      <div className={`bg-[${theme.background}] shadow-2xl rounded-xl overflow-hidden border border-[${theme.border}] backdrop-blur-sm relative group`}>
        <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMi41IiBoZWlnaHQ9IjIuNSIgeD0iMCIgeT0iMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTSAwIDAgTCAyIDAgTCAyIDIgTCAwIDIiIGZpbGw9IiMxMTExMTEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcCkiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay pointer-events-none" />
        
        <table className={`min-w-full divide-y divide-[${theme.border}]`}>
          <thead className={`bg-[${theme.primary}]/5`}>
            <tr>
              <th className={`px-6 py-4 text-left text-xs font-medium text-[${theme.textPrimary}] uppercase tracking-wider`}>
                Index
              </th>
              <th className={`px-6 py-4 text-left text-xs font-medium text-[${theme.textPrimary}] uppercase tracking-wider`}>
                Subject ID
              </th>
              <th className={`px-6 py-4 text-left text-xs font-medium text-[${theme.textPrimary}] uppercase tracking-wider`}>
                Compliance Score
              </th>
              <th className={`px-6 py-4 text-left text-xs font-medium text-[${theme.textPrimary}] uppercase tracking-wider`}>
                Data Points
              </th>
              <th className={`px-6 py-4 text-left text-xs font-medium text-[${theme.textPrimary}] uppercase tracking-wider`}>
                Classification
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-[${theme.border}]`}>
            {filteredUsers.map((user, index) => {
              const isPassingUser = isPassing(user.averageRating)
              const isTop = index === 0

              return (
                <tr 
                  key={user.id} 
                  className={`
                    transition-all duration-300 hover:bg-[${theme.primary}]/5 relative group/row
                    ${isTop ? `bg-[${theme.primary}]/10` : ''}
                    ${!isPassingUser ? `bg-[#ff0000]/5` : `bg-[#42ff00]/5`}
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      text-sm font-medium
                      ${isTop ? `text-[${theme.primary}]` : ''}
                      ${!isPassingUser ? 'text-[#ff0000]' : 'text-[#42ff00]'}
                    `}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserLink
                      userId={user.id}
                      userName={user.name}
                      isPassing={isPassingUser}
                      showCompliance={true}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`
                        text-sm font-mono
                        ${!isPassingUser ? 'text-[#ff0000]' : 'text-[#42ff00]'}
                      `}>
                        {user.averageRating.toFixed(1)}
                      </span>
                      <span className={`ml-1 ${!isPassingUser ? 'text-[#ff0000]/40' : 'text-[#42ff00]/40'}`}>★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      text-sm font-mono
                      ${isTop ? `text-[${theme.primary}]` : ''}
                      ${!isPassingUser ? 'text-[#ff0000]' : 'text-[#42ff00]'}
                    `}>
                      {user.receivedRatings.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      px-3 py-1 inline-flex text-xs leading-5 font-mono rounded-sm border
                      ${isPassingUser 
                        ? `bg-[#42ff00]/5 text-[#42ff00] border-[#42ff00]/20` 
                        : `bg-[#ff0000]/5 text-[#ff0000] border-[#ff0000]/20`}
                    `}>
                      {isPassingUser ? 'COMPLIANT' : 'DEVIANT'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-2 text-xs font-mono">
        <p className={`text-[${theme.primary}]`}>* Subjects with a rating of 3.0 or higher meet compliance standards.</p>
        <p className="text-[#ff0000]">* Non-compliant subjects will be flagged for behavioral adjustment.</p>
      </div>
    </div>
  )
} 