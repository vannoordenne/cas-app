'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActiveUser } from '@/lib/activeUserStore'
import { getTheme } from '@/lib/theme'
import { store } from '@/lib/store'
import UserLink from '@/components/UserLink'
import GlowButton from '@/components/GlowButton'
import GlowLink from '@/components/GlowLink'
import RateSubjects from '@/components/RateSubjects'

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'TEACHER' | null>(null)
  const [recentRatings, setRecentRatings] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    rank: 0
  })
  const [teacherStats, setTeacherStats] = useState({
    classAverage: 0,
    topPerformer: { name: '', rating: 0, id: '' },
    needsAttention: { name: '', rating: 0, id: '' }
  })
  const activeUser = useActiveUser(state => state.user)
  const router = useRouter()
  const theme = getTheme(activeUser?.role || 'STUDENT')

  useEffect(() => {
    if (selectedRole) {
      router.push(`/signin?role=${selectedRole}`)
    }
  }, [selectedRole, router])

  useEffect(() => {
    if (activeUser) {
      if (activeUser.role === 'STUDENT') {
        // Get recent ratings for students
        const ratings = store.getRatingsByReceiverId(activeUser.id)
        setRecentRatings(ratings.slice(0, 3))

        // Calculate stats for students
        const allUsers = store.getAllUsers()
        const userRatings = ratings
        const averageRating = userRatings.length > 0 
          ? userRatings.reduce((acc, r) => acc + r.stars, 0) / userRatings.length 
          : 0

        // Calculate rank (simplified)
        const sortedUsers = [...allUsers].sort((a, b) => {
          const aRatings = store.getRatingsByReceiverId(a.id)
          const bRatings = store.getRatingsByReceiverId(b.id)
          const aAvg = aRatings.length > 0 ? aRatings.reduce((acc, r) => acc + r.stars, 0) / aRatings.length : 0
          const bAvg = bRatings.length > 0 ? bRatings.reduce((acc, r) => acc + r.stars, 0) / bRatings.length : 0
          return bAvg - aAvg
        })
        const rank = sortedUsers.findIndex(u => u.id === activeUser.id) + 1

        setStats({
          totalRatings: userRatings.length,
          averageRating: Number(averageRating.toFixed(1)),
          rank
        })
      } else {
        // Get teacher's class stats
        const allUsers = store.getAllUsers()
        const classStudents = allUsers.filter(user => user.role === 'STUDENT' && user.class === activeUser.class)
        
        // Calculate class average
        const classRatings = classStudents.flatMap(student => 
          store.getRatingsByReceiverId(student.id)
        )
        const classAverage = classRatings.length > 0
          ? classRatings.reduce((acc, r) => acc + r.stars, 0) / classRatings.length
          : 0

        // Find top performer and student needing attention
        const studentStats = classStudents.map(student => {
          const ratings = store.getRatingsByReceiverId(student.id)
          const average = ratings.length > 0
            ? ratings.reduce((acc, r) => acc + r.stars, 0) / ratings.length
            : 0
          return { name: student.name, rating: average, id: student.id }
        })

        const topPerformer = studentStats.reduce((max, current) => 
          current.rating > max.rating ? current : max
        , { name: '', rating: 0, id: '' })

        const needsAttention = studentStats.reduce((min, current) => 
          current.rating < min.rating ? current : min
        , { name: '', rating: 5, id: '' })

        setTeacherStats({
          classAverage: Number(classAverage.toFixed(1)),
          topPerformer,
          needsAttention
        })
      }
    }
  }, [activeUser])

  if (activeUser) {
    return (
      <div className={`min-h-screen bg-[${theme.background}] text-[${theme.textPrimary}] py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative group/title inline-block">
              <h1 className={`text-4xl font-bold text-[${theme.textPrimary}] relative z-10 group-hover/title:tracking-wider transition-all duration-500`}>
                Welcome back, {activeUser.name}
              </h1>
              <div className={`absolute -inset-x-6 -inset-y-4 bg-[${theme.primary}]/20 blur-xl group-hover/title:bg-[${theme.primary}]/30 transition-all duration-500`} />
            </div>
            <p className={`mt-2 text-[${theme.textSecondary}]`}>
              {activeUser.role === 'STUDENT' 
                ? 'Continue your journey in the Conformity Assessment System'
                : 'Monitor and assess student conformity'}
            </p>
          </div>

          {activeUser.role === 'STUDENT' ? (
            <>
              {/* Status Bar */}
              <div className={`mb-12 rounded-xl p-6 border border-[${theme.border}] relative overflow-hidden`}>
                <div className={`absolute inset-0 ${stats.averageRating >= 3 ? `bg-[${theme.primary}]/10` : 'bg-red-500/10'}`} />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <h2 className={`text-2xl font-bold mb-2 ${stats.averageRating >= 3 ? `text-[${theme.primary}]` : 'text-red-400'}`}>
                    {stats.averageRating >= 3 ? 'Compliant' : 'Non-compliant'}
                  </h2>
                  <p className={`text-sm text-[${theme.textSecondary}] mt-2`}>
                    {stats.averageRating >= 3 
                      ? 'You are meeting the expected standards of conformity.'
                      : 'Your behavior requires improvement to meet the expected standards.'}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}]`}>
                  <h3 className={`text-lg font-semibold text-[${theme.textPrimary}] mb-2`}>Total ratings</h3>
                  <Link 
                    href="/ratings" 
                    className="hover:opacity-80 transition-opacity block"
                  >
                    <p className={`text-3xl font-bold text-[${theme.textPrimary}]`}>{stats.totalRatings}</p>
                  </Link>
                </div>
                <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}]`}>
                  <h3 className={`text-lg font-semibold text-[${theme.textPrimary}] mb-2`}>Current rating</h3>
                  <p className={`text-3xl font-bold ${stats.averageRating >= 3 ? `text-[${theme.primary}]` : 'text-red-400'}`}>
                    {stats.averageRating.toFixed(1)}★
                  </p>
                </div>
                <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}]`}>
                  <h3 className={`text-lg font-semibold text-[${theme.textPrimary}] mb-2`}>Current rank</h3>
                  <p className={`text-3xl font-bold ${stats.averageRating >= 3 ? `text-[${theme.primary}]` : 'text-red-400'}`}>#{stats.rank}</p>
                </div>
              </div>

              {/* Quick Rate Section */}
              <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}] mb-12`}>
                <h2 className={`text-xl font-semibold text-[${theme.textPrimary}] mb-4`}>Rate your peers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentRatings
                    .map(rating => store.getUserById(rating.giverId))
                    .filter((user): user is any => user?.role === 'STUDENT')
                    .slice(0, 3)
                    .map(user => (
                      <Link
                        key={user.id}
                        href={`/profile/${user.id}#rate`}
                        className={`flex items-center space-x-4 p-4 rounded-lg border border-[${theme.border}] hover:border-[${theme.primary}] transition-colors group`}
                      >
                        {user.image && (
                          <img
                            src={user.image}
                            alt={user.name}
                            className={`w-12 h-12 rounded-full border border-[${theme.border}] group-hover:border-[${theme.primary}] transition-colors`}
                          />
                        )}
                        <div>
                          <p className={`font-medium text-[${theme.textPrimary}] group-hover:text-[${theme.primary}] transition-colors`}>
                            {user.name}
                          </p>
                          <p className={`text-sm text-[${theme.textSecondary}]`}>
                            {user.class}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
                <GlowLink
                  href="/profiles"
                  className="mt-4 inline-block"
                >
                  View all students
                </GlowLink>
              </div>

              {/* Recent Activity */}
              <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}] mb-12`}>
                <h2 className={`text-xl font-semibold text-[${theme.textPrimary}] mb-4`}>Recent activity</h2>
                {recentRatings.length > 0 ? (
                  <div className="space-y-4">
                    {recentRatings.map((rating, index) => {
                      const rater = store.getUserById(rating.giverId)
                      return (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-lg border border-[${theme.border}]`}>
                          <div className="flex-1">
                            <p className={`text-[${theme.textPrimary}]`}>
                              Rated by{' '}
                              <span className="font-semibold">
                                <UserLink
                                  userId={rating.giverId}
                                  userName={rater?.name || 'Unknown'}
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
                          <Link 
                            href={`/rating/${rating.id}`}
                            className={`text-2xl font-bold ${rating.stars >= 3 ? `text-[${theme.primary}]` : 'text-red-400'} hover:opacity-80 transition-opacity ml-4`}
                          >
                            {rating.stars}★
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className={`text-[${theme.textSecondary}]`}>No recent ratings</p>
                )}
                <GlowLink
                  href="/ratings"
                  className="mt-4 inline-block"
                >
                  View all ratings
                </GlowLink>
              </div>
            </>
          ) : (
            <>
              {/* Class Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}]`}>
                  <h3 className={`text-lg font-semibold text-[${theme.textPrimary}] mb-2`}>Class average</h3>
                  <p className={`text-3xl font-bold text-[${theme.primary}]`}>{teacherStats.classAverage}</p>
                </div>
                <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}]`}>
                  <h3 className={`text-lg font-semibold text-[${theme.textPrimary}] mb-2`}>Top performer</h3>
                  <div className="text-2xl font-bold text-[${theme.primary}] hover:opacity-80 transition-opacity block">
                    <UserLink
                      userId={teacherStats.topPerformer.id}
                      userName={teacherStats.topPerformer.name}
                      className="text-[${theme.primary}] hover:opacity-80"
                    />
                  </div>
                  <p className={`text-sm text-[${theme.primary}]`}>{teacherStats.topPerformer.rating.toFixed(1)}★</p>
                </div>
                <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}]`}>
                  <h3 className={`text-lg font-semibold text-[${theme.textPrimary}] mb-2`}>Needs attention</h3>
                  <div className="text-2xl font-bold text-[#ff0000] hover:opacity-80 transition-opacity block">
                    <UserLink
                      userId={teacherStats.needsAttention.id}
                      userName={teacherStats.needsAttention.name}
                      className="text-[#ff0000] hover:opacity-80"
                    />
                  </div>
                  <p className={`text-sm text-[#ff0000]`}>{teacherStats.needsAttention.rating.toFixed(1)}★</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RateSubjects activeUser={activeUser} />

                <div className={`bg-[${theme.background}] rounded-xl p-6 border border-[${theme.border}] h-[400px] flex flex-col`}>
                  <h2 className={`text-xl font-semibold text-[${theme.textPrimary}] mb-4`}>Your profile</h2>
                  <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-hidden">
                    <div className={`flex items-center space-x-4 p-4 rounded-lg border border-[${theme.border}]`}>
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
                          {activeUser.role === 'TEACHER' ? 'Teacher' : 'Student'} • {activeUser.class}
                        </p>
                      </div>
                    </div>

                    {activeUser.bio && (
                      <div className={`flex-1 rounded-lg border border-[${theme.border}] p-4 min-h-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[${theme.primary}]/20`}>
                        <h3 className={`text-sm font-semibold text-[${theme.textPrimary}] mb-2`}>Bio</h3>
                        <p className={`text-sm text-[${theme.textSecondary}] leading-relaxed`}>
                          {activeUser.bio}
                        </p>
                      </div>
                    )}

                    <Link
                      href={`/profile/${activeUser.id}`}
                      className={`block w-full px-4 py-2 rounded text-sm font-medium bg-[${theme.background}] text-[${theme.textPrimary}] hover:bg-[${theme.backgroundHover}] border border-[${theme.border}] hover:border-[${theme.primary}] hover:shadow-[0_0_15px_rgba(66,255,0,0.3)] transition-all text-center mt-auto`}
                    >
                      View full profile
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[${theme.background}] text-[${theme.textPrimary}] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto text-center">
        <div className="relative group/title inline-block">
          <h1 className={`text-4xl font-bold text-[${theme.textPrimary}] relative z-10 group-hover/title:tracking-wider transition-all duration-500`}>
            Welcome to the Conformity Assessment System
          </h1>
          <div className={`absolute -inset-x-6 -inset-y-4 bg-[${theme.primary}]/20 blur-xl group-hover/title:bg-[${theme.primary}]/30 transition-all duration-500`} />
        </div>
        <p className={`mt-2 text-[${theme.textSecondary}]`}>
          Please select your role to continue
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <GlowButton
            onClick={() => setSelectedRole('TEACHER')}
            className="w-48 h-16 text-lg"
          >
            I am a teacher
          </GlowButton>
          <GlowButton
            onClick={() => setSelectedRole('STUDENT')}
            className="w-48 h-16 text-lg"
          >
            I am a student
          </GlowButton>
        </div>
      </div>
    </div>
  )
} 