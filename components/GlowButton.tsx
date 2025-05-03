import React from 'react'
import { getTheme } from '@/lib/theme'

type GlowButtonProps = {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function GlowButton({ 
  onClick, 
  children, 
  className = '', 
  type = 'button',
  disabled = false 
}: GlowButtonProps) {
  const theme = getTheme('STUDENT')

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group overflow-hidden px-4 py-2 rounded-lg
        bg-black/50 border border-[${theme.primary}]/20
        text-[${theme.textPrimary}] font-mono text-sm
        transition-all duration-200
        hover:shadow-[0_0_15px_rgba(66,255,0,0.3)]
        hover:border-[${theme.primary}]/40
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <span className="relative z-10">
        {children}
      </span>
      <span className={`absolute inset-0 bg-gradient-to-r from-[${theme.primary}]/0 via-[${theme.primary}]/10 to-[${theme.primary}]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
      <span className={`absolute inset-0 bg-[${theme.primary}]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`} />
    </button>
  )
} 