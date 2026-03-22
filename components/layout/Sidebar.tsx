'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookOpen, Languages, PencilLine, User, LogIn, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ProgressWidget } from './ProgressWidget'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navItems = [
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/alphabet', label: 'Alphabet', icon: Languages },
  { href: '/practice', label: 'Practice', icon: PencilLine },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/learn')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-card-dark border-r border-border flex-shrink-0 hidden md:flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-arabic-text arabic">خَطَّاط</h1>
        <p className="text-sm text-text-secondary">Khattat</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                'hover:bg-card-medium hover:border-accent',
                isActive
                  ? 'bg-card-medium border border-accent text-text-primary'
                  : 'border border-transparent text-text-secondary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Progress Widget */}
      <div className="p-4 border-t border-border">
        <ProgressWidget />
      </div>

      {/* Auth footer */}
      <div className="p-4 border-t border-border">
        {user ? (
          <div className="space-y-2">
            <p className="text-xs text-text-muted truncate">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-card-medium hover:text-text-primary transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-card-medium hover:text-text-primary border border-border transition"
          >
            <LogIn className="w-4 h-4" />
            Sign In to sync progress
          </Link>
        )}
      </div>
    </aside>
  )
}
