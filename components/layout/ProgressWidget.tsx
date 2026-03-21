'use client'

import { useProgressStore } from '@/lib/store/useProgressStore'
import { Flame, Trophy } from 'lucide-react'

export function ProgressWidget() {
  const { progress } = useProgressStore()

  const level = Math.floor(progress.totalXP / 100) + 1

  return (
    <div className="space-y-3">
      {/* Level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-gold" />
          <span className="text-sm text-text-secondary">Level</span>
        </div>
        <span className="text-lg font-bold text-text-primary">{level}</span>
      </div>

      {/* Streak */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-warning" />
          <span className="text-sm text-text-secondary">Streak</span>
        </div>
        <span className="text-lg font-bold text-text-primary">
          {progress.currentStreak}
        </span>
      </div>

      {/* XP Bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-muted">XP</span>
          <span className="text-xs text-text-muted">
            {progress.totalXP % 100}/100
          </span>
        </div>
        <div className="h-2 bg-card-medium rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${(progress.totalXP % 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="pt-2 border-t border-border space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Lessons</span>
          <span className="text-text-secondary font-medium">
            {progress.lessonsCompleted.length}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Letters</span>
          <span className="text-text-secondary font-medium">
            {progress.lettersLearned.length}/28
          </span>
        </div>
      </div>
    </div>
  )
}
