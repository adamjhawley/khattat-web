'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Languages, PencilLine, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ProgressWidget } from './ProgressWidget'

const navItems = [
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/alphabet', label: 'Alphabet', icon: Languages },
  { href: '/practice', label: 'Practice', icon: PencilLine },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

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
    </aside>
  )
}
