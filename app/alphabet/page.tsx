'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { arabicLetters } from '@/lib/data/arabic-letters'
import { ArabicLetter } from '@/lib/types/arabic'
import { cn } from '@/lib/utils/cn'

type FilterType = 'all' | 'connecting' | 'non-connecting'

export default function AlphabetPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredLetters = useMemo(() => {
    if (filter === 'connecting') return arabicLetters.filter((l) => l.connects)
    if (filter === 'non-connecting')
      return arabicLetters.filter((l) => !l.connects)
    return arabicLetters
  }, [filter])

  const connectingCount = arabicLetters.filter((l) => l.connects).length
  const nonConnectingCount = arabicLetters.filter((l) => !l.connects).length

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-4xl font-bold text-text-primary mb-2">Alphabet</h1>
        <p className="text-text-secondary">
          Explore all {arabicLetters.length} letters of the Arabic alphabet
        </p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card mb-6 bg-card-medium/50"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-text-primary mb-1">
              Letter Forms
            </h3>
            <p className="text-sm text-text-secondary">
              Arabic letters change shape depending on their position in a word.
              Each card shows the isolated form, plus previews of initial,
              medial, and final forms.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {(['all', 'connecting', 'non-connecting'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all capitalize',
              filter === f
                ? 'bg-accent text-background'
                : 'bg-card-dark border border-border text-text-secondary hover:border-accent'
            )}
          >
            {f === 'all'
              ? `All (${arabicLetters.length})`
              : f === 'connecting'
                ? `Connecting (${connectingCount})`
                : `Non-connecting (${nonConnectingCount})`}
          </button>
        ))}
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {filteredLetters.map((letter, index) => (
          <LetterCard key={letter.id} letter={letter} index={index} />
        ))}
      </div>
    </div>
  )
}

function LetterCard({
  letter,
  index,
}: {
  letter: ArabicLetter
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
    >
      <Link href={`/alphabet/${letter.id}`}>
        <motion.div
          className="card p-4 cursor-pointer group relative h-full"
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Non-connecting badge */}
          {!letter.connects && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-warning rounded-full" />
          )}

          {/* Main letter */}
          <div className="text-center mb-3">
            <div className="text-5xl arabic text-arabic-text mb-2 group-hover:scale-110 transition-transform">
              {letter.isolated}
            </div>
            <div className="text-sm font-semibold text-text-primary">
              {letter.name}
            </div>
            <div className="text-xs text-text-secondary">
              {letter.transliteration}
            </div>
          </div>

          {/* Forms preview */}
          <div className="flex justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-lg arabic text-arabic-text" title="Initial">
              {letter.initial}
            </span>
            <span className="text-lg arabic text-arabic-text" title="Medial">
              {letter.medial}
            </span>
            <span className="text-lg arabic text-arabic-text" title="Final">
              {letter.final}
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
