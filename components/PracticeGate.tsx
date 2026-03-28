'use client'

import Link from 'next/link'
import { Flame, LogIn, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useProgressStore } from '@/lib/store/useProgressStore'
import { FREE_DAILY_PRACTICE_LIMIT } from '@/lib/config/gates'
import { createClient } from '@/lib/supabase/client'

interface PracticeGateProps {
  children: React.ReactNode
}

// Wraps the drawing practice page.
// Not signed in: prompt to sign in.
// Signed in, Pro: unlimited.
// Signed in, Free: FREE_DAILY_PRACTICE_LIMIT sessions/day.
export function PracticeGate({ children }: PracticeGateProps) {
  const { isSubscribed, progress } = useProgressStore()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [])

  // Still resolving auth state — render nothing to avoid flash
  if (isLoggedIn === null) return null

  // Not signed in — prompt to create an account
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="card max-w-sm w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Sign in to practice
          </h2>
          <p className="text-text-secondary text-sm mb-2">
            Create a free account to access drawing practice and track your daily sessions.
          </p>
          <p className="text-text-muted text-xs mb-6">
            Free accounts get {FREE_DAILY_PRACTICE_LIMIT} practice session
            {FREE_DAILY_PRACTICE_LIMIT !== 1 ? 's' : ''} per day.
          </p>

          <Link
            href="/auth?next=/practice"
            className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
          >
            <LogIn className="w-4 h-4" />
            Sign up free
          </Link>

          <Link
            href="/learn"
            className="block text-sm text-text-muted hover:text-text-secondary transition"
          >
            Continue with lessons
          </Link>
        </div>
      </div>
    )
  }

  // Signed in, Pro — unlimited
  if (isSubscribed) return <>{children}</>

  // Signed in, Free — enforce daily limit
  const today = new Date().toISOString().split('T')[0]
  const isNewDay = progress.lastPracticeDate !== today
  const sessionsToday = isNewDay ? 0 : progress.practiceSessionsToday
  const limitReached = sessionsToday >= FREE_DAILY_PRACTICE_LIMIT

  if (!limitReached) return <>{children}</>

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="card max-w-sm w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full mb-4">
          <Flame className="w-8 h-8 text-warning" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Daily limit reached
        </h2>
        <p className="text-text-secondary text-sm mb-2">
          You&apos;ve used your {FREE_DAILY_PRACTICE_LIMIT} free practice session
          {FREE_DAILY_PRACTICE_LIMIT !== 1 ? 's' : ''} for today.
        </p>
        <p className="text-text-muted text-xs mb-6">
          Come back tomorrow for another free session, or go Pro for unlimited practice.
        </p>

        <Link href="/upgrade" className="btn-primary w-full flex items-center justify-center gap-2 mb-3">
          <Zap className="w-4 h-4" />
          Go Pro — unlimited practice
        </Link>

        <Link
          href="/learn"
          className="block text-sm text-text-muted hover:text-text-secondary transition"
        >
          Continue with lessons
        </Link>
      </div>
    </div>
  )
}
