'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useProgressStore } from '@/lib/store/useProgressStore'

interface ProGateProps {
  children: React.ReactNode
}

// Wraps content that requires a Pro subscription.
// If the user is not subscribed, shows an upgrade prompt instead.
export function ProGate({ children }: ProGateProps) {
  const { isSubscribed } = useProgressStore()

  if (isSubscribed) return <>{children}</>

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="card max-w-sm w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
          <Lock className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Pro Content</h2>
        <p className="text-text-secondary text-sm mb-6">
          This lesson is part of the Pro tier. Upgrade to access all 11 lessons and
          unlimited drawing practice.
        </p>
        <Link href="/upgrade" className="btn-primary w-full text-center">
          Upgrade to Pro
        </Link>
        <Link
          href="/learn"
          className="block mt-3 text-sm text-text-muted hover:text-text-secondary transition"
        >
          Back to free lessons
        </Link>
      </div>
    </div>
  )
}
