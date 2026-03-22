export interface ArabicLetter {
  id: string;
  name: string;
  transliteration: string;
  isolated: string;
  initial: string;
  medial: string;
  final: string;
  connects: boolean;
  group: "sun" | "moon";
  description: string;
}

export interface LetterLesson {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  letterIds: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  color: string;
}

export interface QuizQuestion {
  id: string;
  type: "identify_form" | "complete_word" | "match_meaning";
  question: string;
  questionArabic?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MissingLetterExercise {
  id: string;
  wordId: string;
  arabic: string;
  english: string;
  transliteration: string;
  letters: string[];
  missingIndex: number;
  correctLetter: string;
  options: string[];
}

export interface ConnectLettersExercise {
  id: string;
  wordId: string;
  arabic: string;
  english: string;
  transliteration: string;
  letters: string[];
}

export interface UserProgress {
  lessonsCompleted: string[];
  lettersLearned: string[];
  quizScores: Record<string, number>;
  currentStreak: number;
  lastActiveDate: string;
  totalXP: number;
  // Daily practice tracking for free-tier rate limit
  lastPracticeDate: string;
  practiceSessionsToday: number;
}
