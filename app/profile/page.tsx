'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, Flame, BookOpen, Type, Zap, LogIn } from 'lucide-react'
import { useProgressStore } from '@/lib/store/useProgressStore'
import { arabicLetters } from '@/lib/data/arabic-letters'
import { letterLessons } from '@/lib/data/lessons'
import { createClient } from '@/lib/supabase/client'

function ProfilePageInner() {
  const { progress, isSubscribed, loadProgress } = useProgressStore()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
      // Re-fetch subscription status after successful checkout
      // Retry a few times to allow the webhook time to update Supabase
      if (data.user && searchParams.get('upgraded') === '1') {
        const userId = data.user.id
        loadProgress(userId)
        setTimeout(() => loadProgress(userId), 2000)
        setTimeout(() => loadProgress(userId), 5000)
      }
    })
  }, [searchParams, loadProgress])

  const level = Math.floor(progress.totalXP / 100) + 1
  const xpInLevel = progress.totalXP % 100
  const lessonsCompleted = progress.lessonsCompleted.length
  const lettersLearned = progress.lettersLearned.length
  const totalLessons = letterLessons.length
  const totalLetters = arabicLetters.length

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-card-dark border-2 border-accent rounded-full mb-4">
          <span className="text-5xl arabic text-arabic-text">خ</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {userEmail ?? 'Arabic Learner'}
        </h1>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-gold" />
          <span className="text-xl font-semibold text-text-primary">
            Level {level}
          </span>
        </div>
        {!userEmail && (
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg-dark font-semibold rounded-lg hover:bg-accent-light transition"
          >
            <LogIn className="w-4 h-4" />
            Sign in to save progress
          </Link>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-4">Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <Flame className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {progress.currentStreak}
                </div>
                <div className="text-sm text-text-secondary">Day Streak</div>
              </div>

              <div className="card text-center">
                <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {progress.totalXP}
                </div>
                <div className="text-sm text-text-secondary">Total XP</div>
              </div>

              <div className="card text-center">
                <BookOpen className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {lessonsCompleted}
                </div>
                <div className="text-sm text-text-secondary">Lessons</div>
              </div>

              <div className="card text-center">
                <Type className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {lettersLearned}
                </div>
                <div className="text-sm text-text-secondary">Letters</div>
              </div>
            </div>
          </motion.div>

          {/* Progress Bars */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Progress
            </h2>
            <div className="card space-y-6">
              {/* XP Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-primary">
                    Level {level} Progress
                  </span>
                  <span className="text-sm text-text-secondary">
                    {xpInLevel}/100 XP
                  </span>
                </div>
                <div className="h-3 bg-card-medium rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpInLevel}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>

              {/* Lessons Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-primary">
                    Lessons Completed
                  </span>
                  <span className="text-sm text-text-secondary">
                    {lessonsCompleted}/{totalLessons} (
                    {Math.round((lessonsCompleted / totalLessons) * 100)}%)
                  </span>
                </div>
                <div className="h-3 bg-card-medium rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(lessonsCompleted / totalLessons) * 100}%`,
                    }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="h-full bg-success"
                  />
                </div>
              </div>

              {/* Letters Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-primary">
                    Letters Learned
                  </span>
                  <span className="text-sm text-text-secondary">
                    {lettersLearned}/{totalLetters} (
                    {Math.round((lettersLearned / totalLetters) * 100)}%)
                  </span>
                </div>
                <div className="h-3 bg-card-medium rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(lettersLearned / totalLetters) * 100}%`,
                    }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Subscription */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Subscription
            </h2>
            <div className="card">
              {isSubscribed ? (
                <div>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-3">
                      <Trophy className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      Khattat Pro
                    </h3>
                    <p className="text-sm text-text-secondary">Active</p>
                  </div>
                  <button
                    onClick={async () => {
                      setPortalLoading(true)
                      const res = await fetch('/api/stripe/portal', { method: 'POST' })
                      const { url, error } = await res.json()
                      if (error) { alert(error); setPortalLoading(false); return }
                      window.location.href = url
                    }}
                    disabled={portalLoading}
                    className="btn-secondary w-full"
                  >
                    {portalLoading ? 'Redirecting…' : 'Manage Subscription'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-3">
                      <Zap className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">
                      Go Pro
                    </h3>
                    <p className="text-sm text-text-secondary mb-2">
                      All 11 lessons + unlimited practice
                    </p>
                    <div className="text-3xl font-bold text-accent mb-1">
                      $4.99
                    </div>
                    <div className="text-sm text-text-muted">per month</div>
                  </div>
                  <Link href="/upgrade" className="btn-primary w-full text-center block">
                    Upgrade to Pro
                  </Link>
                </div>
              )}
            </div>

            <div className="card mt-6">
              <h3 className="font-semibold text-text-primary mb-2">About</h3>
              <p className="text-sm text-text-secondary mb-2">
                Khattat is an interactive Arabic learning app focusing on letter
                formation and connection rules.
              </p>
              <p className="text-xs text-text-muted">Version 1.0.0</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfilePageInner />
    </Suspense>
  )
}
