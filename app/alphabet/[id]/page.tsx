'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Info } from 'lucide-react'
import { arabicLetters } from '@/lib/data/arabic-letters'
import { cn } from '@/lib/utils/cn'

export default function LetterDetailPage() {
  const params = useParams()
  const id = params.id as string
  const letter = arabicLetters.find((l) => l.id === id)

  if (!letter) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Letter not found
          </h2>
          <Link
            href="/alphabet"
            className="text-accent hover:text-accent-light transition"
          >
            Go back to alphabet
          </Link>
        </div>
      </div>
    )
  }

  const forms = [
    { label: 'Isolated', arabic: letter.isolated, desc: 'Standing alone' },
    {
      label: 'Initial',
      arabic: letter.initial,
      desc: 'Start of a connected group',
    },
    {
      label: 'Medial',
      arabic: letter.medial,
      desc: 'Middle of a connected group',
    },
    {
      label: 'Final',
      arabic: letter.final,
      desc: 'End of a connected group',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/alphabet">
        <motion.button
          className="flex items-center gap-2 text-text-secondary hover:text-accent transition mb-6"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Alphabet</span>
        </motion.button>
      </Link>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-9xl arabic text-arabic-text mb-4"
        >
          {letter.isolated}
        </motion.div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {letter.name}
        </h1>
        <p className="text-xl text-text-secondary mb-4">
          {letter.transliteration}
        </p>
        {!letter.connects && (
          <div className="inline-block bg-warning/20 text-warning text-sm font-semibold px-3 py-1.5 rounded-lg">
            Non-connecting letter
          </div>
        )}
      </motion.div>

      {/* Letter Forms */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Letter Forms
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {forms.map((form, index) => (
            <motion.div
              key={form.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="card text-center"
            >
              <div className="text-6xl arabic text-arabic-text mb-3">
                {form.arabic}
              </div>
              <div className="font-semibold text-text-primary mb-1">
                {form.label}
              </div>
              <div className="text-sm text-text-secondary">{form.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Connection Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="card mb-8"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-text-primary mb-2">
              Connection Rule
            </h3>
            <p className="text-text-secondary">
              {letter.connects
                ? 'This letter connects to both the preceding and following letters in a word.'
                : 'This letter only connects to the preceding letter. It does not connect to letters that follow it.'}
            </p>
            <p className="text-sm text-text-muted mt-2">
              Classification: {letter.group === 'sun' ? 'Sun' : 'Moon'} letter
            </p>
          </div>
        </div>
      </motion.div>

      {/* Description */}
      {letter.description && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="card"
        >
          <h3 className="font-semibold text-text-primary mb-2">About</h3>
          <p className="text-text-secondary">{letter.description}</p>
        </motion.div>
      )}
    </div>
  )
}
