'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  RotateCcw,
  Trophy,
  Zap,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { DrawingCanvas } from '@/components/practice/DrawingCanvas'
import { useProgressStore } from '@/lib/store/useProgressStore'
import { practiceWords, PracticeWord, WordLetter } from '@/lib/data/practice-words'
import { arabicLetters } from '@/lib/data/arabic-letters'
import { PracticeGate } from '@/components/PracticeGate'

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

function PracticePageInner() {
  const { saveQuizScore, recordPracticeSession, progress } = useProgressStore()
  const [session, setSession] = useState<WordDrawExercise[]>(() => buildSession())
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [complete, setComplete] = useState<boolean>(false)
  const [state, setState] = useState<ExerciseState>('drawing')
  const [showHint, setShowHint] = useState(false)

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
      recordPracticeSession(finalPct)
      setScore(newScore)
      setComplete(true)
      return
    }

    setScore(newScore)
    setCurrentIndex((i) => i + 1)
    setState('drawing')
    setShowHint(false)
  }

  const handleRestart = () => {
    const newSession = buildSession()
    setSession(newSession)
    setCurrentIndex(0)
    setScore(0)
    setComplete(false)
    setState('drawing')
    setShowHint(false)
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
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-lg mb-2">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">+{Math.round(10 + (finalPct / 100) * 20)} XP</span>
          </div>
          {isNewBest && (
            <div className="inline-flex items-center gap-2 bg-success/20 text-success px-4 py-2 rounded-lg mb-6">
              <CheckCircle2 className="w-4 h-4" />
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
      <div className="mb-4">
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
        className="card mb-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Word with missing letter */}
          <div className="flex-1 w-full">
            <h2 className="text-base font-bold text-text-primary mb-2 text-center sm:text-left">
              Draw the missing letter
            </h2>
            <div className="flex items-center justify-center gap-2 mb-1 flex-wrap" dir="rtl">
              {exercise.word.letters.map((letter, i) => (
                <div
                  key={i}
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${
                    i === exercise.missingIndex
                      ? 'bg-accent/20 border-2 border-accent'
                      : 'bg-card-medium'
                  }`}
                >
                  {i === exercise.missingIndex ? (
                    <span className="text-2xl font-bold text-accent">?</span>
                  ) : (
                    <span className="text-3xl arabic text-arabic-text">
                      {letter.displayChar}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-text-secondary">
              {exercise.word.meaning}
            </p>
          </div>

          {/* Hint */}
          <div className="bg-card-medium rounded-lg p-3 flex items-center gap-3 sm:flex-col sm:text-center">
            <div className="text-5xl arabic text-arabic-text leading-none">
              {exercise.missingLetter.isolated}
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">
                {arabicLetters.find(l => l.id === exercise.missingLetter.letterId)?.name}
              </div>
              <div className="text-xs text-text-secondary">
                {FORM_LABELS[exercise.missingLetter.form]} form
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Drawing Canvas + Reveal — canvas stays mounted so the drawing is preserved */}
      <div className={`flex gap-6 ${state === 'reveal' ? 'flex-col md:flex-row items-center md:items-start justify-center' : 'flex-col items-center'}`}>
        <div className="flex flex-col items-center">
          <DrawingCanvas
            key={exercise.id}
            ghostLetter={showHint ? exercise.missingLetter.displayChar : undefined}
            disabled={state === 'reveal'}
            onDrawStart={() => {}}
          />
          {state === 'drawing' && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => setShowHint(h => !h)}
                className="flex items-center gap-2 px-4 py-2 bg-card-dark border border-border rounded-lg hover:bg-card-medium transition text-sm text-text-secondary"
              >
                {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              <button onClick={handleReveal} className="btn-primary">
                <Eye className="w-5 h-5 inline mr-2" />
                Check
              </button>
            </div>
          )}
          {state === 'reveal' && (
            <p className="text-sm text-text-muted mt-2">Your drawing</p>
          )}
        </div>

        <AnimatePresence>
          {state === 'reveal' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="card text-center md:self-center"
            >
              <h3 className="text-lg font-bold text-text-primary mb-4">
                Correct Answer
              </h3>
              <div className="text-8xl arabic text-arabic-text mb-2">
                {exercise.missingLetter.displayChar}
              </div>
              <p className="text-sm text-text-secondary mb-6">
                {arabicLetters.find(l => l.id === exercise.missingLetter.letterId)?.name} ({FORM_LABELS[exercise.missingLetter.form]} form)
              </p>
              <p className="text-base font-semibold text-text-primary mb-4">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function PracticePage() {
  return (
    <PracticeGate>
      <PracticePageInner />
    </PracticeGate>
  )
}
