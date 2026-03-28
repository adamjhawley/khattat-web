'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, LogIn } from 'lucide-react'
import { letterLessons } from '@/lib/data/lessons'
import { arabicLetters } from '@/lib/data/arabic-letters'
import { useProgressStore } from '@/lib/store/useProgressStore'
import { ArabicLetter } from '@/lib/types/arabic'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function LessonDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { progress, completeLesson, learnLetter } = useProgressStore()

  const lesson = letterLessons.find((l) => l.id === id)

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Lesson not found
          </h2>
          <Link
            href="/learn"
            className="text-accent hover:text-accent-light transition"
          >
            Go back to lessons
          </Link>
        </div>
      </div>
    )
  }

  const isCompleted = progress.lessonsCompleted.includes(lesson.id)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [])
  const letters = lesson.letterIds
    .map((lid: string) => arabicLetters.find((l) => l.id === lid))
    .filter((l: ArabicLetter | undefined): l is ArabicLetter => l !== undefined)

  const handleComplete = () => {
    lesson.letterIds.forEach((lid: string) => learnLetter(lid))
    completeLesson(lesson.id, lesson.letterIds.length * 15)
  }

  const difficultyColors = {
    beginner: 'bg-success/20 text-success',
    intermediate: 'bg-warning/20 text-warning',
    advanced: 'bg-error/20 text-error',
  }

  const content = (
    <div className="max-w-4xl mx-auto">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
        style={{ borderColor: `${lesson.color}40` }}
      >
        <h1
          className="text-5xl font-bold arabic mb-4"
          style={{ color: lesson.color }}
        >
          {lesson.titleArabic}
        </h1>
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          {lesson.title}
        </h2>
        <p className="text-text-secondary mb-6">{lesson.description}</p>

        <div className="flex items-center gap-4">
          <span
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-semibold capitalize',
              difficultyColors[lesson.difficulty as keyof typeof difficultyColors]
            )}
          >
            {lesson.difficulty}
          </span>
          <span className="text-sm text-text-muted">
            {letters.length} letters
          </span>
          {isCompleted && (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Completed</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Letters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {letters.map((letter: ArabicLetter, index: number) => {
          const isLearned = progress.lettersLearned.includes(letter.id)

          return (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/alphabet/${letter.id}`}>
                <motion.div
                  className={cn(
                    'card cursor-pointer group relative',
                    isLearned && 'border-success/50'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLearned && (
                    <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-success" />
                  )}

                  <div className="text-center mb-4">
                    <div className="text-6xl arabic text-arabic-text mb-2">
                      {letter.isolated}
                    </div>
                    <div className="text-lg font-semibold text-text-primary">
                      {letter.name}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {letter.transliteration}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-2xl arabic text-arabic-text">
                        {letter.initial}
                      </div>
                      <div className="text-xs text-text-muted">Initial</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl arabic text-arabic-text">
                        {letter.medial}
                      </div>
                      <div className="text-xs text-text-muted">Medial</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl arabic text-arabic-text">
                        {letter.final}
                      </div>
                      <div className="text-xs text-text-muted">Final</div>
                    </div>
                  </div>

                  {!letter.connects && (
                    <div className="inline-block bg-warning/20 text-warning text-xs font-semibold px-2 py-1 rounded">
                      Non-connecting
                    </div>
                  )}

                  <ChevronRight className="absolute bottom-3 right-3 w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Complete Button */}
      {!isCompleted && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleComplete}
          className="btn-primary w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Mark as Complete (+{lesson.letterIds.length * 15} XP)
        </motion.button>
      )}

      {isCompleted && (
        <Link href="/learn">
          <motion.button
            className="btn-secondary w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Lessons
          </motion.button>
        </Link>
      )}

      {/* Sign-in nudge for logged-out users */}
      {isLoggedIn === false && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex items-center justify-between bg-card-dark border border-accent/30 rounded-xl px-4 py-3"
        >
          <p className="text-sm text-text-secondary">
            Sign in to save your progress across devices
          </p>
          <Link
            href="/auth"
            className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-light transition ml-4 flex-shrink-0"
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </Link>
        </motion.div>
      )}
    </div>
  )

  return content
}
