'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useActiveUser } from '@/lib/activeUserStore'
import { getTheme } from '@/lib/theme'
import { store } from '@/lib/store'
import UserLink from '@/components/UserLink'

export default function RatingsPage() {
  const [ratings, setRatings] = useState<any[]>([])
  const activeUser = useActiveUser(state => state.user)
  const theme = getTheme(activeUser?.role || 'STUDENT')
  
  useEffect(() => {
    if (activeUser) {
      // Get all ratings for the current student
      const userRatings = store.getRatingsByReceiverId(activeUser.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      // Enrich with giver data
      const enrichedRatings = userRatings.map(rating => {
        const giver = store.getUserById(rating.giverId)
        return {
          ...rating,
          giver
        }
      })
      
      setRatings(enrichedRatings)
    }
  }, [activeUser])

  if (!activeUser) {
    return <div>Loading...</div>
  }

  return (
    <div className={`min-h-screen bg-[${theme.background}] text-[${theme.textPrimary}] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold text-[${theme.textPrimary}]`}>
              All Ratings
            </h1>
            <p className={`mt-2 text-[${theme.textSecondary}]`}>
              Showing all ratings for your profile
            </p>
          </div>
          <Link 
            href="/"
            className={`px-4 py-2 rounded-lg bg-[${theme.primary}]/10 text-[${theme.primary}] hover:bg-[${theme.primary}]/20 transition-colors border border-[${theme.primary}]/20`}
          >
            Back to Dashboard
          </Link>
        </div>

        <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}]`}>
          {ratings.length > 0 ? (
            <div className="space-y-6">
              {ratings.map((rating) => (
                <div key={rating.id} className={`flex items-center justify-between p-4 rounded-lg border border-[${theme.border}] hover:border-[${theme.primary}]/30 transition-colors`}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      {rating.giver?.image && (
                        <img
                          src={rating.giver.image}
                          alt={rating.giver.name}
                          className={`w-12 h-12 rounded-full border border-[${theme.border}]`}
                        />
                      )}
                      <div>
                        <p className={`text-[${theme.textPrimary}]`}>
                          Rated by{' '}
                          <span className="font-semibold">
                            <UserLink
                              userId={rating.giverId}
                              userName={rating.giver?.name || 'Unknown'}
                              className="hover:text-[${theme.primary}]"
                            />
                          </span>
                        </p>
                        <p className={`text-sm text-[${theme.textSecondary}] mt-1`}>
                          {rating.description}
                        </p>
                        {rating.comment && (
                          <p className={`text-sm text-[${theme.textSecondary}] mt-1 italic`}>
                            "{rating.comment}"
                          </p>
                        )}
                        <p className={`text-sm text-[${theme.textSecondary}] mt-1`}>
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${rating.stars >= 3 ? `text-[${theme.primary}]` : 'text-red-400'} hover:opacity-80 transition-opacity ml-4`}>
                    {rating.stars}★
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-[${theme.textSecondary}]`}>No ratings yet</p>
          )}
        </div>
      </div>
    </div>
  )
} 