'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Languages, PencilLine, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/alphabet', label: 'Alphabet', icon: Languages },
  { href: '/practice', label: 'Practice', icon: PencilLine },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card-dark border-t border-border flex md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname?.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors',
              isActive ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
