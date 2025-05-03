'use client'

import React, { useState, useEffect } from 'react'
import { store } from '@/lib/store'
import { useActiveUser } from '@/lib/activeUserStore'
import { getTheme } from '@/lib/theme'
import GlowButton from '@/components/GlowButton'

type RatingFormProps = {
  receiverId: string
  onRatingSubmitted?: () => void
}

export default function RatingForm({ receiverId, onRatingSubmitted }: RatingFormProps) {
  const [stars, setStars] = useState(3)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<{ currentAverage: number; newAverage: number } | null>(null)
  const activeUser = useActiveUser(state => state.user)
  const theme = getTheme(activeUser?.role || 'STUDENT')

  const calculatePreview = (selectedStars: number) => {
    const ratings = store.getRatingsByReceiverId(receiverId)
    const totalStars = ratings.reduce((sum, r) => sum + r.stars, 0)
    const currentAverage = ratings.length > 0 ? totalStars / ratings.length : 0
    const newAverage = (totalStars + selectedStars) / (ratings.length + 1)
    
    setPreview({
      currentAverage: Math.round(currentAverage * 10) / 10,
      newAverage: Math.round(newAverage * 10) / 10
    })
  }

  useEffect(() => {
    calculatePreview(stars)
  }, [stars, receiverId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!activeUser) {
      alert('Please sign in to submit a rating')
      return
    }

    if (activeUser.id === receiverId) {
      alert('You cannot rate yourself')
      return
    }

    setIsSubmitting(true)

    try {
      store.createRating({
        giverId: activeUser.id,
        receiverId,
        stars,
        comment
      })

      setComment('')
      setStars(3)
      calculatePreview(3) // Reset preview with new default stars
      if (onRatingSubmitted) {
        onRatingSubmitted()
      }
    } catch (error) {
      console.error('Failed to submit rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't show the form if trying to rate yourself
  if (activeUser?.id === receiverId) {
    return (
      <div className={`p-4 rounded-lg bg-black/50 border border-[${theme.border}] backdrop-blur-sm`}>
        <p className={`text-[${theme.textSecondary}] text-center`}>You cannot rate yourself</p>
      </div>
    )
  }

  // Show sign-in prompt if no active user
  if (!activeUser) {
    return (
      <div className={`p-4 rounded-lg bg-black/50 border border-[${theme.border}] backdrop-blur-sm`}>
        <p className={`text-[${theme.textSecondary}] text-center`}>Please sign in to submit ratings</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className={`block text-sm font-medium text-[${theme.textSecondary}]`}>
          Rating as <span className={`text-[${theme.primary}]`}>{activeUser.name}</span>
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStars(value)}
              className={`w-12 h-12 rounded-lg transition-all duration-200 ${
                stars >= value 
                  ? `bg-[${theme.primary}]/20 text-[${theme.primary}] hover:bg-[${theme.primary}]/30` 
                  : `bg-black/50 text-[${theme.primary}]/20 hover:bg-[${theme.primary}]/10`
              }`}
            >
              ★
            </button>
          ))}
        </div>
        {preview && (
          <div className={`mt-3 text-sm text-[${theme.textSecondary}] bg-black/50 rounded-lg p-3 border border-[${theme.border}] backdrop-blur-sm font-mono`}>
            Current score: <span className={`text-[${theme.primary}]`}>{preview.currentAverage}</span> ★ 
            → New score: <span className={`text-[${theme.primary}]`}>{preview.newAverage}</span> ★
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className={`block text-sm font-medium text-[${theme.textSecondary}]`}>Assessment Notes</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg bg-black/50 border border-[${theme.border}] text-[${theme.textSecondary}] placeholder-[${theme.textSecondary}]/40 focus:outline-none focus:border-[${theme.primary}]/30 transition-colors backdrop-blur-sm`}
          rows={3}
          placeholder="Enter behavioral observations..."
        />
      </div>

      <div className="mt-6">
        <GlowButton
          type="submit"
          disabled={!comment.trim()}
          className="w-full"
        >
          Submit Assessment
        </GlowButton>
      </div>
    </form>
  )
} 