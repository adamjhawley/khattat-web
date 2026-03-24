import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProgress } from '@/lib/types/arabic'
import { createClient } from '@/lib/supabase/client'

interface ProgressStore {
  // State
  progress: UserProgress
  isSubscribed: boolean

  // Progress actions
  completeLesson: (lessonId: string, xp: number) => void
  learnLetter: (letterId: string) => void
  saveQuizScore: (quizId: string, score: number) => void
  recordPracticeSession: (scorePct?: number) => void

  // Supabase sync
  loadProgress: (userId: string) => Promise<void>
  syncProgress: (progress: UserProgress) => Promise<void>

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
  lastPracticeDate: '',
  practiceSessionsToday: 0,
}

async function upsertProgress(userId: string, progress: UserProgress) {
  const supabase = createClient()
  await supabase.from('user_progress').upsert({
    user_id: userId,
    lessons_completed: progress.lessonsCompleted,
    letters_learned: progress.lettersLearned,
    quiz_scores: progress.quizScores,
    current_streak: progress.currentStreak,
    last_active_date: progress.lastActiveDate,
    total_xp: progress.totalXP,
    last_practice_date: progress.lastPracticeDate,
    practice_sessions_today: progress.practiceSessionsToday,
    updated_at: new Date().toISOString(),
  })
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: DEFAULT_PROGRESS,
      isSubscribed: false,

      completeLesson: (lessonId: string, xp: number) => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
          const wasActiveYesterday = state.progress.lastActiveDate === yesterday

          if (state.progress.lessonsCompleted.includes(lessonId)) {
            return state
          }

          const next: UserProgress = {
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
          }

          get().syncProgress(next)
          return { progress: next }
        })
      },

      learnLetter: (letterId: string) => {
        set((state) => {
          if (state.progress.lettersLearned.includes(letterId)) return state
          const next: UserProgress = {
            ...state.progress,
            lettersLearned: [...state.progress.lettersLearned, letterId],
          }
          get().syncProgress(next)
          return { progress: next }
        })
      },

      saveQuizScore: (quizId: string, score: number) => {
        set((state) => {
          const next: UserProgress = {
            ...state.progress,
            quizScores: { ...state.progress.quizScores, [quizId]: score },
          }
          get().syncProgress(next)
          return { progress: next }
        })
      },

      recordPracticeSession: (scorePct = 0) => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const isNewDay = state.progress.lastPracticeDate !== today
          const xpEarned = Math.round(10 + (scorePct / 100) * 20) // 10–30 XP based on score
          const next: UserProgress = {
            ...state.progress,
            lastPracticeDate: today,
            practiceSessionsToday: isNewDay ? 1 : state.progress.practiceSessionsToday + 1,
            totalXP: state.progress.totalXP + xpEarned,
          }
          get().syncProgress(next)
          return { progress: next }
        })
      },

      loadProgress: async (userId: string) => {
        const supabase = createClient()

        // Load progress
        const { data: progressRow } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()

        // Load subscription
        const { data: subRow } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', userId)
          .maybeSingle()

        const isSubscribed = subRow?.status === 'active'

        if (progressRow) {
          set({
            progress: {
              lessonsCompleted: progressRow.lessons_completed ?? [],
              lettersLearned: progressRow.letters_learned ?? [],
              quizScores: progressRow.quiz_scores ?? {},
              currentStreak: progressRow.current_streak ?? 0,
              lastActiveDate: progressRow.last_active_date ?? '',
              totalXP: progressRow.total_xp ?? 0,
              lastPracticeDate: progressRow.last_practice_date ?? '',
              practiceSessionsToday: progressRow.practice_sessions_today ?? 0,
            },
            isSubscribed,
          })
        } else {
          // First login — seed the DB with current local progress
          const { error } = await supabase.from('user_progress').upsert({
            user_id: userId,
            lessons_completed: get().progress.lessonsCompleted,
            letters_learned: get().progress.lettersLearned,
            quiz_scores: get().progress.quizScores,
            current_streak: get().progress.currentStreak,
            last_active_date: get().progress.lastActiveDate,
            total_xp: get().progress.totalXP,
            last_practice_date: get().progress.lastPracticeDate,
            practice_sessions_today: get().progress.practiceSessionsToday,
            updated_at: new Date().toISOString(),
          })
          if (error) console.error('Failed to seed user_progress:', error)
          set({ isSubscribed })
        }
      },

      syncProgress: async (progress: UserProgress) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await upsertProgress(user.id, progress)
      },

      subscribe: () => set({ isSubscribed: true }),
      unsubscribe: () => set({ isSubscribed: false }),

      reset: () => set({ progress: DEFAULT_PROGRESS, isSubscribed: false }),
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
