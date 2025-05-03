'use client'

import React, { useState } from 'react'
import { store } from '@/lib/store'
import { getTheme } from '@/lib/theme'
import UserLink from '@/components/UserLink'
import GlowLink from '@/components/GlowLink'
import Link from 'next/link'
import RateSubjects from '@/components/RateSubjects'

export default function TeacherPage() {
  const theme = getTheme('TEACHER')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const activeUser = store.getUserByEmail('vannoordenne@university.edu')
  if (!activeUser) return null

  const students = store.getAllUsers().filter(user => user.role === 'STUDENT' && user.class === activeUser.class)
  const ratings = students.map(student => ({
    ...student,
    rating: store.getRatingsByReceiverId(student.id).reduce((acc, rating) => acc + rating.stars, 0) / 
           store.getRatingsByReceiverId(student.id).length || 0
  }))

  const teacherStats = {
    needsAttention: ratings.reduce((min, student) => student.rating < min.rating ? student : min),
    topPerformer: ratings.reduce((max, student) => student.rating > max.rating ? student : max)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim()) {
      const results = store.getAllUsers()
        .filter(user => 
          user.role === 'STUDENT' && 
          user.name.toLowerCase().includes(term.toLowerCase())
        )
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto py-8">
        <div className="relative mb-8 group">
          <h1 className={`text-4xl font-bold text-[${theme.textPrimary}] relative z-10 group-hover:tracking-wider transition-all duration-500`}>
            Teacher Dashboard
          </h1>
          <div className={`absolute -inset-x-6 -inset-y-4 bg-[${theme.primary}]/20 blur-xl group-hover:bg-[${theme.primary}]/30 transition-all duration-500`} />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className={`relative group`}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search subjects..."
              className={`
                w-full px-6 py-4 rounded-xl
                bg-black/50
                border-2 border-[${theme.border}]
                text-[${theme.textPrimary}]
                placeholder-[${theme.textSecondary}]/80
                focus:outline-none focus:border-[${theme.primary}]
                shadow-lg shadow-[${theme.primary}]/10
                backdrop-blur-sm
                transition-all duration-300
                group-hover:border-[${theme.primary}]/60
                text-lg
              `}
            />
            <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl`} />
          </div>

          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className={`
              mt-2 p-4 rounded-xl
              bg-black/80
              border-2 border-[${theme.border}]
              shadow-lg shadow-[${theme.primary}]/10
              backdrop-blur-sm
              max-h-60 overflow-y-auto
              scrollbar-thin scrollbar-track-black scrollbar-thumb-[${theme.primary}]/20
            `}>
              <div className="space-y-2">
                {searchResults.map(student => (
                  <Link
                    key={student.id}
                    href={`/profile/${student.id}`}
                    className={`
                      block p-3 rounded-lg
                      hover:bg-[${theme.primary}]/10
                      transition-colors duration-200
                      group/result
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {student.image && (
                        <img
                          src={student.image}
                          alt={student.name}
                          className={`w-8 h-8 rounded-full border border-[${theme.border}]`}
                        />
                      )}
                      <div>
                        <div className={`font-medium text-[${theme.textPrimary}] group-hover/result:text-[${theme.primary}] transition-colors`}>
                          {student.name}
                        </div>
                        <div className={`text-sm text-[${theme.textSecondary}]`}>
                          {student.class}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Needs Attention Card */}
          <div className={`bg-[${theme.background}] shadow-2xl rounded-xl overflow-hidden border border-[${theme.border}] backdrop-blur-sm relative group`}>
            <div className={`absolute inset-0 bg-gradient-to-b from-[#ff0000]/5 to-transparent pointer-events-none`} />
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 text-[#ff0000]`}>
                Needs Attention
              </h2>
              <div className="space-y-2">
                <div className="text-2xl font-bold transition-opacity block text-[#ff00ff]">
                  <UserLink
                    userId={teacherStats.needsAttention.id}
                    userName={teacherStats.needsAttention.name}
                    isPassing={teacherStats.needsAttention.rating >= 3}
                    showCompliance={true}
                    className="hover:opacity-80"
                  />
                </div>
                <div className="text-3xl font-bold text-[#ff0000]">
                  {teacherStats.needsAttention.rating.toFixed(1)}
                  <span className="text-[#ff0000]/40 ml-1">★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performer Card */}
          <div className={`bg-[${theme.background}] shadow-2xl rounded-xl overflow-hidden border border-[${theme.border}] backdrop-blur-sm relative group`}>
            <div className={`absolute inset-0 bg-gradient-to-b from-[#42ff00]/5 to-transparent pointer-events-none`} />
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 text-[#42ff00]`}>
                Top Performer
              </h2>
              <div className="space-y-2">
                <div className="text-2xl font-bold transition-opacity block text-[#42ff00]">
                  <UserLink
                    userId={teacherStats.topPerformer.id}
                    userName={teacherStats.topPerformer.name}
                    isPassing={teacherStats.topPerformer.rating >= 3}
                    showCompliance={true}
                    className="hover:opacity-80"
                  />
                </div>
                <div className="text-3xl font-bold text-[#42ff00]">
                  {teacherStats.topPerformer.rating.toFixed(1)}
                  <span className="text-[#42ff00]/40 ml-1">★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <RateSubjects 
            activeUser={activeUser} 
            className="col-span-2 shadow-2xl backdrop-blur-sm" 
            title="Rate Subjects"
          />

          {/* Profile Card */}
          <div className={`bg-[${theme.background}] shadow-2xl rounded-xl overflow-hidden border border-[${theme.border}] backdrop-blur-sm relative group col-span-2 h-[400px]`}>
            <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
            <div className="p-6 h-full flex flex-col">
              <h2 className={`text-xl font-bold mb-4 text-[${theme.textPrimary}]`}>
                Your Profile
              </h2>
              
              <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-hidden">
                <div className={`flex items-center space-x-4 p-4 rounded-lg border border-[${theme.border}] bg-black/30`}>
                  {activeUser.image && (
                    <img
                      src={activeUser.image}
                      alt={activeUser.name}
                      className={`w-16 h-16 rounded-full border-2 border-[${theme.border}]`}
                    />
                  )}
                  <div>
                    <p className={`font-semibold text-[${theme.textPrimary}]`}>{activeUser.name}</p>
                    <p className={`text-sm text-[${theme.textSecondary}]`}>
                      Teacher • {activeUser.class}
                    </p>
                  </div>
                </div>

                {activeUser.bio && (
                  <div className={`flex-1 rounded-lg border border-[${theme.border}] p-4 min-h-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[${theme.primary}]/20 bg-black/30`}>
                    <h3 className={`text-sm font-semibold text-[${theme.textPrimary}] mb-2`}>Bio</h3>
                    <p className={`text-sm text-[${theme.textSecondary}] leading-relaxed`}>
                      {activeUser.bio}
                    </p>
                  </div>
                )}

                <GlowLink
                  href={`/profile/${activeUser.id}`}
                  className="block w-full text-center mt-auto"
                >
                  View full profile
                </GlowLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 