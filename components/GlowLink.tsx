import React from 'react'
import Link from 'next/link'
import { getTheme } from '@/lib/theme'

type GlowLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export default function GlowLink({ href, children, className = '' }: GlowLinkProps) {
  const theme = getTheme('STUDENT')

  return (
    <Link
      href={href}
      className={`
        relative group overflow-hidden px-4 py-2 rounded-lg
        bg-black/50 border border-[${theme.primary}]/20
        text-[${theme.textPrimary}] font-mono text-sm
        transition-all duration-200
        hover:shadow-[0_0_10px_rgba(66,255,0,0.2)]
        hover:border-[${theme.primary}]/40
        ${className}
      `}
    >
      <span className="relative z-10">
        {children}
      </span>
      <span className={`absolute inset-0 bg-gradient-to-r from-[${theme.primary}]/0 via-[${theme.primary}]/5 to-[${theme.primary}]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
    </Link>
  )
} 