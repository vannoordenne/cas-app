import React from 'react'
import Link from 'next/link'
import { getTheme } from '@/lib/theme'

type UserLinkProps = {
  userId: string
  userName: string
  isTop?: boolean
  isPassing?: boolean
  className?: string
  showCompliance?: boolean
}

export default function UserLink({ 
  userId, 
  userName, 
  isTop = false,
  isPassing = true,
  className = '',
  showCompliance = false
}: UserLinkProps) {
  const theme = getTheme('STUDENT')

  return (
    <Link
      href={`/profile/${userId}`}
      className={`
        font-mono transition-all duration-200
        ${isPassing ? 'text-[#42ff00]' : 'text-[#ff0000]'}
        ${className}
      `}
    >
      {userName}
    </Link>
  )
} 