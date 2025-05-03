'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { store } from '@/lib/store'
import { getTheme } from '@/lib/theme'

type RateSubjectsProps = {
  activeUser: any
  className?: string
  title?: string
  height?: string
}

export default function RateSubjects({ 
  activeUser, 
  className = '', 
  title = 'Rate subjects',
  height = 'h-[400px]' 
}: RateSubjectsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const theme = getTheme(activeUser?.role || 'TEACHER')

  const students = store.getAllUsers().filter(user => 
    user.role === 'STUDENT' && 
    (searchTerm === '' || user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const ratings = students.map(student => ({
    ...student,
    rating: store.getRatingsByReceiverId(student.id).reduce((acc, rating) => acc + rating.stars, 0) / 
           store.getRatingsByReceiverId(student.id).length || 0
  }))

  return (
    <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}] flex flex-col ${height} ${className}`}>
      <h2 className={`text-xl font-semibold text-[${theme.textPrimary}] mb-3`}>{title}</h2>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`
              w-full px-3 py-2 
              bg-black/50
              border-2 border-[${theme.border}]
              rounded-lg 
              text-[${theme.textPrimary}] 
              placeholder-[${theme.textSecondary}]/80
              focus:outline-none 
              focus:border-[${theme.primary}] 
              focus:ring-1 
              focus:ring-[${theme.primary}]
              shadow-md shadow-[${theme.primary}]/10
              transition-all duration-300
              text-sm
            `}
          />
        </div>
        <div className="flex-1 overflow-hidden rounded-lg border-2 border-[${theme.border}] bg-black/30 min-h-0">
          <div className={`
            h-full overflow-y-auto
            scrollbar-thin 
            scrollbar-track-transparent 
            scrollbar-thumb-[${theme.primary}]/20
            p-1.5
          `}>
            {students.length > 0 ? (
              <div className="flex flex-col divide-y divide-[${theme.border}]">
                {students.map(student => (
                  <Link
                    key={student.id}
                    href={`/profile/${student.id}#rate`}
                    className={`
                      py-2 px-2.5
                      hover:bg-black/50
                      group/student
                      transition-all duration-200
                      first:pt-1 last:pb-1
                    `}
                  >
                    <div className="flex items-center space-x-2.5">
                      {student.image && (
                        <img
                          src={student.image}
                          alt={student.name}
                          className={`w-8 h-8 min-w-[2rem] rounded-full border border-[${theme.border}] group-hover/student:border-[${theme.primary}]/40 transition-colors`}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className={`font-medium text-sm text-[${theme.textPrimary}] group-hover/student:text-[${theme.primary}] transition-colors truncate`}>
                          {student.name}
                        </div>
                        <div className={`text-xs text-[${theme.textSecondary}] flex items-center space-x-2`}>
                          <span className="truncate">{student.class}</span>
                          <span className="flex-shrink-0">•</span>
                          <span className="flex items-center flex-shrink-0">
                            {ratings.find(r => r.id === student.id)?.rating.toFixed(1)}
                            <span className={`ml-1 text-[${theme.primary}]/40`}>★</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[${theme.textSecondary}] flex-shrink-0">
                        {store.getRatingsByReceiverId(student.id).length} ratings
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className={`text-[${theme.textSecondary}] text-sm`}>No subjects found</p>
              </div>
            )}
          </div>
        </div>
        <Link
          href="/profiles"
          className={`mt-3 block w-full px-4 py-2 rounded text-sm font-medium bg-[${theme.background}] text-[${theme.textPrimary}] hover:bg-[${theme.backgroundHover}] border border-[${theme.border}] hover:border-[${theme.primary}] hover:shadow-[0_0_15px_rgba(66,255,0,0.3)] transition-all text-center`}
        >
          Browse all subjects
        </Link>
      </div>
    </div>
  )
} 