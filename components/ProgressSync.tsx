'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useProgressStore } from '@/lib/store/useProgressStore'

// Mounts in layout; loads Supabase progress when a user is logged in and
// clears local state on sign-out. No visible UI.
export function ProgressSync() {
  const { loadProgress, reset } = useProgressStore()

  useEffect(() => {
    const supabase = createClient()

    // Check initial auth state
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadProgress(data.user.id)
    })

    // Keep in sync as the session changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProgress(session.user.id)
      } else {
        reset()
      }
    })

    return () => subscription.unsubscribe()
  }, [loadProgress, reset])

  return null
}
