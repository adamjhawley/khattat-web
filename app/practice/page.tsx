'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  RotateCcw,
  Trophy,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { DrawingCanvas } from '@/components/practice/DrawingCanvas'
import { useProgressStore } from '@/lib/store/useProgressStore'
import { practiceWords, PracticeWord, WordLetter } from '@/lib/data/practice-words'
import { arabicLetters } from '@/lib/data/arabic-letters'

const SESSION_SIZE = 8

const FORM_LABELS: Record<string, string> = {
  isolated: 'Isolated',
  initial: 'Initial',
  medial: 'Medial',
  final: 'Final',
}

interface WordDrawExercise {
  id: string
  word: PracticeWord
  missingIndex: number
  missingLetter: WordLetter
}

function buildSession(): WordDrawExercise[] {
  const pool: WordDrawExercise[] = []

  for (const word of practiceWords) {
    for (let i = 0; i < word.letters.length; i++) {
      pool.push({
        id: `${word.id}_${i}`,
        word,
        missingIndex: i,
        missingLetter: word.letters[i],
      })
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, SESSION_SIZE)
}

type ExerciseState = 'drawing' | 'reveal' | 'self-eval'

export default function PracticePage() {
  const { saveQuizScore, progress } = useProgressStore()
  const [session, setSession] = useState<WordDrawExercise[]>(() => buildSession())
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [complete, setComplete] = useState<boolean>(false)
  const [state, setState] = useState<ExerciseState>('drawing')

  const bestScore = progress.quizScores['drawing_practice'] ?? 0

  const exercise = useMemo(() => session[currentIndex], [session, currentIndex])

  const handleReveal = () => {
    setState('reveal')
  }

  const handleSelfEval = (correct: boolean) => {
    const addScore = correct ? 1 : 0
    const newScore = score + addScore

    if (currentIndex + 1 >= session.length) {
      const finalPct = Math.round((newScore / session.length) * 100)
      saveQuizScore('drawing_practice', finalPct)
      setScore(newScore)
      setComplete(true)
      return
    }

    setScore(newScore)
    setCurrentIndex((i) => i + 1)
    setState('drawing')
  }

  const handleRestart = () => {
    const newSession = buildSession()
    setSession(newSession)
    setCurrentIndex(0)
    setScore(0)
    setComplete(false)
    setState('drawing')
  }

  if (complete) {
    const finalPct = Math.round((score / session.length) * 100)
    const isNewBest = finalPct > bestScore

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="card">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Session Complete!
          </h1>
          <div className="text-6xl font-bold text-accent mb-4">{finalPct}%</div>
          <p className="text-text-secondary mb-2">
            You got {score} out of {session.length} correct
          </p>
          {isNewBest && (
            <div className="inline-flex items-center gap-2 bg-success/20 text-success px-4 py-2 rounded-lg mb-6">
              <Zap className="w-4 h-4" />
              <span className="font-semibold">New Best Score!</span>
            </div>
          )}
          {!isNewBest && bestScore > 0 && (
            <p className="text-sm text-text-muted mb-6">
              Best: {bestScore}%
            </p>
          )}
          <button onClick={handleRestart} className="btn-primary">
            <RotateCcw className="w-5 h-5 inline mr-2" />
            Practice Again
          </button>
        </div>
      </motion.div>
    )
  }

  if (!exercise) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text-primary">
            Exercise {currentIndex + 1} of {session.length}
          </span>
          <span className="text-sm text-text-secondary">
            Score: {score}/{currentIndex}
          </span>
        </div>
        <div className="h-2 bg-card-medium rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / session.length) * 100}%`,
            }}
            className="h-full bg-accent"
          />
        </div>
      </div>

      {/* Word Display */}
      <motion.div
        key={exercise.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <h2 className="text-xl font-bold text-text-primary mb-4 text-center">
          Draw the missing letter
        </h2>

        {/* Word with missing letter */}
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap" dir="rtl">
          {exercise.word.letters.map((letter, i) => (
            <div
              key={i}
              className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${
                i === exercise.missingIndex
                  ? 'bg-accent/20 border-2 border-accent'
                  : 'bg-card-medium'
              }`}
            >
              {i === exercise.missingIndex ? (
                <span className="text-3xl font-bold text-accent">?</span>
              ) : (
                <span className="text-4xl arabic text-arabic-text">
                  {letter.displayChar}
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-text-secondary mb-4">
          Word: {exercise.word.meaning}
        </p>

        {/* Hint Card */}
        <div className="bg-card-medium rounded-lg p-4 max-w-sm mx-auto">
          <div className="text-center mb-2">
            <span className="text-xs text-text-muted uppercase">
              Letter to draw
            </span>
          </div>
          <div className="text-center mb-2">
            <div className="text-6xl arabic text-arabic-text mb-1">
              {exercise.missingLetter.isolated}
            </div>
            <div className="text-sm font-semibold text-text-primary">
              {arabicLetters.find(l => l.id === exercise.missingLetter.letterId)?.name}
            </div>
            <div className="text-xs text-text-secondary">
              {FORM_LABELS[exercise.missingLetter.form]} form
            </div>
          </div>
        </div>
      </motion.div>

      {/* Drawing Canvas */}
      <AnimatePresence mode="wait">
        {state === 'drawing' && (
          <motion.div
            key="canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DrawingCanvas
              ghostLetter={exercise.missingLetter.displayChar}
              onDrawStart={() => {}}
            />
            <div className="text-center mt-4">
              <button onClick={handleReveal} className="btn-primary">
                <Eye className="w-5 h-5 inline mr-2" />
                Check My Drawing
              </button>
            </div>
          </motion.div>
        )}

        {state === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="card max-w-md mx-auto">
              <h3 className="text-lg font-bold text-text-primary mb-4">
                Correct Answer
              </h3>
              <div className="text-8xl arabic text-arabic-text mb-4">
                {exercise.missingLetter.displayChar}
              </div>
              <p className="text-sm text-text-secondary mb-6">
                {arabicLetters.find(l => l.id === exercise.missingLetter.letterId)?.name} ({FORM_LABELS[exercise.missingLetter.form]} form)
              </p>
              <p className="text-lg font-semibold text-text-primary mb-4">
                Did you draw it correctly?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleSelfEval(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-success/20 text-success rounded-lg font-semibold hover:bg-success/30 transition"
                >
                  <ThumbsUp className="w-5 h-5" />
                  Yes
                </button>
                <button
                  onClick={() => handleSelfEval(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-error/20 text-error rounded-lg font-semibold hover:bg-error/30 transition"
                >
                  <ThumbsDown className="w-5 h-5" />
                  No
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
