'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Zap, BookOpen, PencilLine, Cloud, Infinity } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const FREE_FEATURES = [
  { icon: BookOpen, text: '4 beginner lessons' },
  { icon: PencilLine, text: '1 drawing practice session/day' },
  { icon: Cloud, text: 'Cloud progress sync' },
]

const PRO_FEATURES = [
  { icon: BookOpen, text: 'All 11 lessons (beginner → advanced)' },
  { icon: Infinity, text: 'Unlimited drawing practice' },
  { icon: Cloud, text: 'Cloud progress sync' },
  { icon: Zap, text: 'Full quiz history' },
]

export default function UpgradePage() {
  const router = useRouter()
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth?next=/upgrade')
      return
    }

    setLoading(true)
    const priceId = billing === 'monthly'
      ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const { url, error } = await res.json()
    if (error) {
      alert(error)
      setLoading(false)
      return
    }
    window.location.href = url
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
          <Zap className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-3">Upgrade to Khattat Pro</h1>
        <p className="text-text-secondary max-w-md mx-auto">
          Unlock all lessons and unlimited drawing practice to master the full Arabic alphabet.
        </p>
      </motion.div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-card-medium rounded-xl p-1 gap-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              billing === 'monthly'
                ? 'bg-card-dark text-text-primary shadow'
                : 'text-text-secondary'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              billing === 'annual'
                ? 'bg-card-dark text-text-primary shadow'
                : 'text-text-secondary'
            }`}
          >
            Annual
            <span className="text-xs bg-success/20 text-success px-1.5 py-0.5 rounded font-bold">
              Save 33%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Free */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-lg font-bold text-text-primary mb-1">Free</h2>
          <div className="text-3xl font-bold text-text-primary mb-4">
            $0<span className="text-base text-text-secondary font-normal">/mo</span>
          </div>
          <ul className="space-y-3 mb-6">
            {FREE_FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-text-secondary">
                <Check className="w-4 h-4 text-success flex-shrink-0" />
                {text}
              </li>
            ))}
          </ul>
          <div className="text-center text-sm text-text-muted border border-border rounded-lg py-2">
            Current plan
          </div>
        </motion.div>

        {/* Pro */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="card border-accent/50 relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-accent text-card-dark text-xs font-bold px-3 py-1 rounded-full">
              RECOMMENDED
            </span>
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-1">Pro</h2>
          <div className="text-3xl font-bold text-accent mb-1">
            {billing === 'monthly' ? '$4.99' : '$3.33'}
            <span className="text-base text-text-secondary font-normal">/mo</span>
          </div>
          {billing === 'annual' && (
            <p className="text-xs text-text-muted mb-3">Billed $39.99/year</p>
          )}
          <ul className="space-y-3 mb-6">
            {PRO_FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-text-secondary">
                <Check className="w-4 h-4 text-accent flex-shrink-0" />
                {text}
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {loading ? 'Redirecting…' : `Get Pro — ${billing === 'monthly' ? '$4.99/mo' : '$39.99/yr'}`}
          </button>
        </motion.div>
      </div>

      <p className="text-center text-xs text-text-muted">
        Secure payment via Stripe · Cancel anytime from your profile
      </p>
    </div>
  )
}
