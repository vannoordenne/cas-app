'use client'

import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { store } from '@/lib/store'
import RatingForm from '@/components/RatingForm'
import { useActiveUser } from '@/lib/activeUserStore'
import { getTheme } from '@/lib/theme'
import UserLink from '@/components/UserLink'
import GlowButton from '@/components/GlowButton'
import Link from 'next/link'

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [ratings, setRatings] = useState<any[]>([])
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [teacherStudents, setTeacherStudents] = useState<any[]>([])
  const activeUser = useActiveUser(state => state.user)
  const theme = getTheme(activeUser?.role || 'STUDENT')

  const loadUserData = () => {
    const userData = store.getUserById(params.id)
    if (!userData) {
      notFound()
    }

    const userRatings = store.getRatingsByReceiverId(params.id)
    const enrichedRatings = userRatings.map(rating => {
      const giver = store.getUserById(rating.giverId)
      return {
        ...rating,
        giver
      }
    })

    // If user is a teacher, get their students
    if (userData.role === 'TEACHER') {
      const students = store.getAllUsers()
        .filter(u => u.role === 'STUDENT' && u.class === userData.class)
      setTeacherStudents(students)
    }

    // For demo purposes, we'll consider student1 (Alice) as the logged-in user
    setIsOwnProfile(params.id === 'student1')
    setUser(userData)
    setRatings(enrichedRatings)
  }

  useEffect(() => {
    const loadUserData = async () => {
      const userData = store.getUserById(params.id)
      if (userData) {
        setUser(userData)
        
        // Get ratings for the user and sort them from newest to oldest
        const userRatings = store.getRatingsByReceiverId(params.id)
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
    }
    loadUserData()
  }, [params.id])

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[${theme.primary}]`}></div>
    </div>
  }

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
    : 0

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className={`bg-[${theme.background}] shadow-2xl rounded-xl overflow-hidden border border-[${theme.border}] backdrop-blur-sm relative`}>
        <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMi41IiBoZWlnaHQ9IjIuNSIgeD0iMCIgeT0iMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTSAwIDAgTCAyIDAgTCAyIDIgTCAwIDIiIGZpbGw9IiMxMTExMTEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcCkiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay pointer-events-none" />
        
        {/* Profile Header */}
        <div className={`p-6 sm:p-8 bg-[${theme.primary}]/5 backdrop-blur relative group`}>
          <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
          <div className="flex items-center space-x-6 relative z-10">
            {user.image && (
              <img
                src={user.image}
                alt={user.name}
                className={`w-24 h-24 rounded-full border-2 border-[${theme.border}] shadow-xl`}
              />
            )}
            <div className="relative group/title">
              <h1 className={`text-3xl font-bold text-[${theme.textPrimary}] relative z-10 group-hover/title:tracking-wider transition-all duration-500`}>
                {user.name}
              </h1>
              <div className={`absolute -inset-x-6 -inset-y-4 bg-[${theme.primary}]/20 blur-xl group-hover/title:bg-[${theme.primary}]/30 transition-all duration-500`} />
              <p className={`text-[${theme.textSecondary}] mt-1`}>{user.role}</p>
              {user.class && <p className={`mt-3 text-[${theme.textSecondary}]`}>{user.class}</p>}
            </div>
          </div>
          <div className="mt-6 flex items-center space-x-4 relative z-10">
            {ratings.length > 0 && (
              <div className={`text-[${theme.textSecondary}] font-mono`}>
                {ratings.length} {ratings.length === 1 ? 'data point' : 'data points'}
              </div>
            )}
            {ratings.length > 0 && (
              <div className={`flex items-center text-[${theme.textSecondary}] font-mono`}>
                <span className={`text-[${theme.primary}] mr-1`}>★</span>
                {averageRating.toFixed(1)} compliance score
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {user.bio && (
          <div className={`p-6 border-t border-[${theme.border}] relative`}>
            <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
            <h2 className={`text-xl font-bold mb-4 text-[${theme.textPrimary}] relative`}>
              {user.role === 'TEACHER' ? 'Teacher profile' : 'Subject profile'}
            </h2>
            <p className={`text-[${theme.textSecondary}] relative z-10 leading-relaxed`}>
              {user.bio}
            </p>
          </div>
        )}

        {/* Rating Form - only show for student profiles */}
        {!isOwnProfile && user.role === 'STUDENT' && (
          <div className={`p-6 border-t border-[${theme.border}] relative`}>
            <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
            <h2 className={`text-xl font-bold mb-4 text-[${theme.textPrimary}] relative`}>
              Submit assessment
            </h2>
            <RatingForm 
              receiverId={params.id} 
              onRatingSubmitted={loadUserData}
            />
          </div>
        )}

        {/* Ratings List - only show for student profiles */}
        {user.role === 'STUDENT' && (
          <div className={`p-6 border-t border-[${theme.border}] relative`}>
            <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
            <h2 className={`text-xl font-bold mb-6 text-[${theme.textPrimary}] relative`}>
              Assessment history
            </h2>
            <div className="space-y-6">
              {ratings.map((rating) => (
                <div key={rating.id} className={`bg-[${theme.background}] rounded-xl p-6 backdrop-blur-sm border border-[${theme.border}] relative group`}>
                  <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      {rating.giver?.image && (
                        <img
                          src={rating.giver.image}
                          alt={rating.giver.name}
                          className={`w-10 h-10 rounded-full border border-[${theme.border}]`}
                        />
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className={`font-medium text-[${theme.textPrimary}] group-hover:text-[${theme.primary}] transition-colors`}>
                            <UserLink
                              userId={rating.giver.id}
                              userName={rating.giver.name}
                              className="hover:text-[${theme.primary}]"
                            />
                          </div>
                          {rating.giver?.role === 'TEACHER' && (
                            <div className={`px-2 py-0.5 rounded-full bg-[${theme.primary}]/20 text-[${theme.primary}] text-xs font-medium border border-[${theme.primary}]/30`}>
                              Teacher
                            </div>
                          )}
                        </div>
                        <div className={`text-sm text-[${theme.textSecondary}] font-mono`}>
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-[${theme.primary}] text-xl`}>{'★'.repeat(rating.stars)}</span>
                      <span className={`text-[${theme.textSecondary}]/20 text-xl`}>{'★'.repeat(5 - rating.stars)}</span>
                    </div>
                  </div>
                  {rating.comment && (
                    <p className={`mt-4 text-[${theme.textSecondary}] relative z-10`}>{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teacher's Given Ratings - only show for teacher profiles */}
        {user.role === 'TEACHER' && (
          <div className={`p-6 border-t border-[${theme.border}] relative`}>
            <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
            <h2 className={`text-xl font-bold mb-6 text-[${theme.textPrimary}] relative`}>
              Assessment history given
            </h2>
            <TeacherRatingHistory teacherId={user.id} theme={theme} />
          </div>
        )}
      </div>
    </div>
  )
}

// Component for teacher's given ratings history
function TeacherRatingHistory({ teacherId, theme }: { teacherId: string; theme: any }) {
  const [givenRatings, setGivenRatings] = useState<any[]>([])
  
  useEffect(() => {
    const ratings = store.getRatingsByGiverId(teacherId)
    const enrichedRatings = ratings.map(rating => {
      const receiver = store.getUserById(rating.receiverId)
      return {
        ...rating,
        receiver
      }
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    setGivenRatings(enrichedRatings)
  }, [teacherId])

  if (givenRatings.length === 0) {
    return (
      <div className={`bg-[${theme.background}] rounded-xl p-6 backdrop-blur-sm border border-[${theme.border}]`}>
        <p className={`text-[${theme.textSecondary}]`}>No assessments given yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {givenRatings.map((rating) => (
        <div key={rating.id} className={`bg-[${theme.background}] rounded-xl p-6 pt-8 backdrop-blur-sm border border-[${theme.border}] relative group`}>
          <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
          
          {/* Assessment Label */}
          <div className={`absolute top-2 left-4 px-3 py-1 rounded-full bg-[${theme.primary}]/20 text-[${theme.primary}] text-xs font-medium border border-[${theme.primary}]/30 z-20`}>
            Assessment given
          </div>
          
          <div className="flex items-center justify-between relative z-10 mt-2">
            <div className="flex items-center space-x-4">
              {rating.receiver?.image && (
                <img
                  src={rating.receiver.image}
                  alt={rating.receiver.name}
                  className={`w-10 h-10 rounded-full border border-[${theme.border}]`}
                />
              )}
              <div>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm text-[${theme.textSecondary}]`}>Subject:</span>
                  <span className={`font-medium text-[${theme.textPrimary}] group-hover:text-[${theme.primary}] transition-colors`}>
                    <UserLink
                      userId={rating.receiver.id}
                      userName={rating.receiver.name}
                      className="hover:text-[${theme.primary}]"
                    />
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <span className={`text-xs text-[${theme.textSecondary}] font-mono`}>
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`mx-2 text-xs text-[${theme.textSecondary}]`}>•</span>
                  <span className={`text-xs text-[${theme.textSecondary}]`}>
                    {rating.receiver.class}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className={`text-[${theme.primary}] text-xl`}>{'★'.repeat(rating.stars)}</span>
                <span className={`text-[${theme.textSecondary}]/20 text-xl`}>{'★'.repeat(5 - rating.stars)}</span>
              </div>
              <div className={`text-xs text-[${theme.textSecondary}] mt-1`}>
                {rating.stars >= 3 ? 'Compliant' : 'Non-compliant'}
              </div>
            </div>
          </div>
          
          {rating.comment && (
            <div className="mt-4 relative z-10">
              <div className={`text-xs text-[${theme.textSecondary}] mb-1 font-medium`}>Teacher's assessment:</div>
              <p className={`text-[${theme.textSecondary}] p-3 bg-black/30 rounded-lg border border-[${theme.border}] italic`}>
                "{rating.comment}"
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 