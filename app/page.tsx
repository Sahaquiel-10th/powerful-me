'use client'

import { useState, useEffect } from 'react'
import DailyQuote from '@/components/daily-quote'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen w-full bg-background overflow-hidden flex items-center justify-center flex-row tracking-widest">
      <DailyQuote />
    </main>
  )
}
