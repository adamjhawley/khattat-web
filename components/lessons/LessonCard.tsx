'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface LessonCardProps {
  id: string
  title: string
  titleArabic: string
  description: string
  difficulty: string
  color: string
  letterCount: number
  learnedCount: number
  isCompleted: boolean
  index: number
}

const difficultyColors = {
  beginner: 'text-success border-success/30',
  intermediate: 'text-warning border-warning/30',
  advanced: 'text-error border-error/30',
}

export function LessonCard({
  id,
  title,
  titleArabic,
  description,
  difficulty,
  letterCount,
  learnedCount,
  isCompleted,
  index,
}: LessonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/learn/${id}`}>
        <motion.div
          className={cn(
            'card card-hover cursor-pointer group',
            isCompleted && 'border-success/50'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start gap-4">
            {/* Left side */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-arabic-text arabic">
                  {titleArabic}
                </h2>
                {isCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {title}
              </h3>
              <p className="text-sm text-text-secondary mb-3">{description}</p>

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'text-xs font-semibold px-2.5 py-1 rounded-lg border capitalize',
                    difficultyColors[difficulty as keyof typeof difficultyColors] ||
                      'text-text-secondary border-border'
                  )}
                >
                  {difficulty}
                </span>
                <span className="text-sm text-text-secondary">
                  {learnedCount}/{letterCount} letters
                </span>
              </div>
            </div>

            {/* Right side - Progress indicator */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-card-medium"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - learnedCount / letterCount)}`}
                    className="text-accent transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-text-primary">
                    {Math.round((learnedCount / letterCount) * 100)}%
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
