import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProgress } from '@/lib/types/arabic'

interface ProgressStore {
  // State
  progress: UserProgress
  isSubscribed: boolean

  // Progress actions
  completeLesson: (lessonId: string, xp: number) => void
  learnLetter: (letterId: string) => void
  saveQuizScore: (quizId: string, score: number) => void

  // Subscription actions
  subscribe: () => void
  unsubscribe: () => void

  // Utilities
  reset: () => void
}

const DEFAULT_PROGRESS: UserProgress = {
  lessonsCompleted: [],
  lettersLearned: [],
  quizScores: {},
  currentStreak: 0,
  lastActiveDate: '',
  totalXP: 0,
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      progress: DEFAULT_PROGRESS,
      isSubscribed: false,

      completeLesson: (lessonId: string, xp: number) => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
          const wasActiveYesterday = state.progress.lastActiveDate === yesterday

          // Don't add duplicate lesson
          if (state.progress.lessonsCompleted.includes(lessonId)) {
            return state
          }

          return {
            progress: {
              ...state.progress,
              lessonsCompleted: [...state.progress.lessonsCompleted, lessonId],
              totalXP: state.progress.totalXP + xp,
              lastActiveDate: today,
              currentStreak:
                state.progress.lastActiveDate === today
                  ? state.progress.currentStreak
                  : wasActiveYesterday
                    ? state.progress.currentStreak + 1
                    : 1,
            },
          }
        })
      },

      learnLetter: (letterId: string) => {
        set((state) => {
          // Don't add duplicate letter
          if (state.progress.lettersLearned.includes(letterId)) {
            return state
          }

          return {
            progress: {
              ...state.progress,
              lettersLearned: [...state.progress.lettersLearned, letterId],
            },
          }
        })
      },

      saveQuizScore: (quizId: string, score: number) => {
        set((state) => ({
          progress: {
            ...state.progress,
            quizScores: {
              ...state.progress.quizScores,
              [quizId]: score,
            },
          },
        }))
      },

      subscribe: () => {
        set({ isSubscribed: true })
      },

      unsubscribe: () => {
        set({ isSubscribed: false })
      },

      reset: () => {
        set({ progress: DEFAULT_PROGRESS, isSubscribed: false })
      },
    }),
    {
      name: 'khattat-storage',
      partialize: (state) => ({
        progress: state.progress,
        isSubscribed: state.isSubscribed,
      }),
    }
  )
)
