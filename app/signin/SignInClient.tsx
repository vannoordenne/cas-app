'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { store } from '@/lib/store'
import { useActiveUser } from '@/lib/activeUserStore'
import { getTheme } from '@/lib/theme'
import GlowButton from '@/components/GlowButton'

export default function SignInClient() {
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') as 'STUDENT' | 'TEACHER' | null
  const setActiveUser = useActiveUser(state => state.setUser)
  const theme = getTheme(role || 'STUDENT')

  useEffect(() => {
    if (!role) {
      router.push('/')
      return
    }

    const allUsers = store.getAllUsers()
    const filteredUsers = allUsers.filter(user => user.role === role)
    setUsers(filteredUsers)
  }, [role, router])

  const handleSignIn = (userId: string) => {
    const user = store.getUserById(userId)
    if (user) {
      setActiveUser(user)
      router.push('/')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!role) {
    return null
  }

  return (
    <div className={`min-h-screen bg-[${theme.background}] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="relative group/title inline-block">
            <h1 className={`text-4xl font-bold text-[${theme.textPrimary}] mb-2 relative z-10 group-hover/title:tracking-wider transition-all duration-500`}>
              Select your identity
            </h1>
            <div className={`absolute -inset-x-6 -inset-y-4 bg-[${theme.primary}]/20 blur-xl group-hover/title:bg-[${theme.primary}]/30 transition-all duration-500`} />
          </div>
          <p className={`text-[${theme.textSecondary}]`}>
            Choose your role to access the Conformity Assessment System
          </p>
        </div>

        <div className={`bg-[${theme.background}] shadow-2xl rounded-xl overflow-hidden border border-[${theme.border}] backdrop-blur-sm relative`}>
          <div className={`absolute inset-0 bg-gradient-to-b from-[${theme.primary}]/5 to-transparent pointer-events-none`} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMi41IiBoZWlnaHQ9IjIuNSIgeD0iMCIgeT0iMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTSAwIDAgTCAyIDAgTCAyIDIgTCAwIDIiIGZpbGw9IiMxMTExMTEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcCkiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay pointer-events-none" />
          
          <div className="p-6">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 bg-black/50 border border-[${theme.border}] rounded-lg text-[${theme.textPrimary}] placeholder-[${theme.textSecondary}]/80 focus:outline-none focus:border-[${theme.primary}] focus:ring-1 focus:ring-[${theme.primary}]`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className={`flex items-center justify-between p-4 rounded-lg border border-[${theme.border}]`}>
                  <div className="flex items-center space-x-4">
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.name}
                        className={`w-12 h-12 rounded-full border border-[${theme.border}]`}
                      />
                    )}
                    <div>
                      <p className={`font-medium text-[${theme.textPrimary}]`}>{user.name}</p>
                      <p className={`text-sm text-[${theme.textSecondary}]`}>{user.class || user.role}</p>
                    </div>
                  </div>
                  <GlowButton
                    onClick={() => handleSignIn(user.id)}
                    className="px-4 py-2 text-sm"
                  >
                    Sign in
                  </GlowButton>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 