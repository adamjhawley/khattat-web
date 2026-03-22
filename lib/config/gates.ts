// First 4 lessons (all "beginner" difficulty) are free.
// Lesson IDs come from lib/data/lessons.ts.
export const FREE_LESSON_IDS: string[] = ['group1', 'group2', 'group3', 'group4']

export const isLessonFree = (id: string) => FREE_LESSON_IDS.includes(id)

// Free users get this many practice sessions per calendar day.
export const FREE_DAILY_PRACTICE_LIMIT = 1
