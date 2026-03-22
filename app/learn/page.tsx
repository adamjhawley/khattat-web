'use client'

import { motion } from 'framer-motion'
import { Flame, Star, Type } from 'lucide-react'
import { letterLessons } from '@/lib/data/lessons'
import { arabicLetters } from '@/lib/data/arabic-letters'
import { useProgressStore } from '@/lib/store/useProgressStore'
import { LessonCard } from '@/components/lessons/LessonCard'
import { isLessonFree } from '@/lib/config/gates'

export default function LearnPage() {
  const { progress } = useProgressStore()

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-arabic-text arabic mb-2">
              الحروف
            </h1>
            <p className="text-lg text-text-secondary">
              Master the Arabic alphabet
            </p>
          </div>
          <div className="flex items-center gap-2 bg-card-dark border border-warning/30 rounded-xl px-4 py-2">
            <Flame className="w-5 h-5 text-warning" />
            <span className="text-2xl font-bold text-text-primary">
              {progress.currentStreak}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 bg-card-dark border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-accent" />
            <div>
              <div className="text-xl font-bold text-text-primary">
                {progress.totalXP}
              </div>
              <div className="text-xs text-text-secondary">XP</div>
            </div>
          </div>

          <div className="w-px h-10 bg-border" />

          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-success" />
            <div>
              <div className="text-xl font-bold text-text-primary">
                {progress.lessonsCompleted.length}
              </div>
              <div className="text-xs text-text-secondary">Lessons</div>
            </div>
          </div>

          <div className="w-px h-10 bg-border" />

          <div className="flex items-center gap-3">
            <span className="text-2xl arabic">ع</span>
            <div>
              <div className="text-xl font-bold text-text-primary">
                {progress.lettersLearned.length}/{arabicLetters.length}
              </div>
              <div className="text-xs text-text-secondary">Letters</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {letterLessons.map((lesson, index) => {
          const isCompleted = progress.lessonsCompleted.includes(lesson.id)
          const learnedCount = lesson.letterIds.filter((lid: string) =>
            progress.lettersLearned.includes(lid)
          ).length

          return (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              titleArabic={lesson.titleArabic}
              description={lesson.description}
              difficulty={lesson.difficulty}
              color={lesson.color}
              letterCount={lesson.letterIds.length}
              learnedCount={learnedCount}
              isCompleted={isCompleted}
              locked={!isLessonFree(lesson.id)}
              index={index}
            />
          )
        })}
      </div>
    </div>
  )
}
