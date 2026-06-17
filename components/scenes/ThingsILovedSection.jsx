'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LOVED_THINGS = [
  { text: 'your laugh', size: 'lg', italic: true },
  { text: 'Your motherly side', size: 'md', italic: false },
  { text: 'Your inner child', size: 'md', italic: true },
  { text: 'Your reminders about wudu and skincare.', size: 'xl', italic: false },
  { text: 'How you remind me to turn off my laptop before I fall asleep.', size: 'xl', italic: false },
  { text: 'our late night conversations / roblox', size: 'lg', italic: true },
  { text: 'Seeing your name pop up in my notifications.', size: 'lg', italic: false },
  { text: 'the excitement before meeting you', size: 'md', italic: true },
  { text: 'getting lost in random conversations', size: 'lg', italic: false },
  { text: 'the comfort of your presence', size: 'xl', italic: true },
  { text: 'the way you remembered small things', size: 'md', italic: false },
  { text: 'waiting for your reply', size: 'sm', italic: true },
  { text: 'your excitement over small things', size: 'md', italic: false },
  { text: 'the way you looked when you were happy', size: 'lg', italic: true },
  { text: 'your complaints about your day', size: 'md', italic: false },
  { text: 'the silence that never felt awkward', size: 'lg', italic: false },
  { text: 'the way we could talk about nothing for hours', size: 'xl', italic: true },
  { text: 'the good mornings', size: 'sm', italic: false },
  { text: 'the good nights', size: 'sm', italic: true },
  { text: 'the unexpected reassurance', size: 'md', italic: false },
  { text: 'the moments you believed in me', size: 'lg', italic: true },
  { text: 'the way you made ordinary days feel different', size: 'xl', italic: false },
  { text: 'your attention to little details', size: 'md', italic: false },
  { text: 'our favorite songs', size: 'sm', italic: true },
  { text: 'the memories in places', size: 'md', italic: false },
  { text: 'the comfort of knowing you were there', size: 'lg', italic: true },
  { text: 'everything that felt like home', size: 'xl', italic: false },
]

const SIZE_MAP = {
  sm: 'clamp(1rem, 1.3vw, 1.4rem)',
  md: 'clamp(1.3rem, 2vw, 2rem)',
  lg: 'clamp(1.8rem, 3vw, 3rem)',
  xl: 'clamp(2.2rem, 4.2vw, 4.5rem)',
}

export default function ThingsILovedSection() {
  const containerRef = useRef(null)
  const hasStarted = useRef(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const timeoutsRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          if (hasStarted.current) return
          hasStarted.current = true
          
          // Memunculkan ingatan satu per satu dengan ritme yang nyaman
          LOVED_THINGS.forEach((_, i) => {
            const t = setTimeout(() => {
              setVisibleCount(i + 1)
            }, 400 + i * 220) // Kecepatan muncul beruntun yang konstan
            timeoutsRef.current.push(t)
          })
        },
      })
    }, container)

    return () => {
      ctx.revert()
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full pb-32"
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
      }}
    >
      {/* Glow lembut atmospheric di latar belakang */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at 60% 50%, rgba(245, 242, 235, 0.03) 0%, transparent 70%)',
        }}
      />

      {/* ── HEADER ── */}
      <div className="pt-24 px-8 md:px-20 mb-16 relative z-30">
        <p className="text-[11px] font-mono tracking-[0.4em] text-[#f5f2eb] opacity-20 uppercase mb-4">
          006 / Reminiscing
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[#f5f2eb] font-light leading-[0.9]"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          Things I Loved<span className="opacity-30">.</span>
        </motion.h2>
        <div className="mt-6 h-px bg-[#f5f2eb] opacity-10 max-w-[160px]" />
      </div>

      {/* ── ORGANIC FLOATING CONTAINER (LAPTOP OPTIMIZED) ── */}
      <div className="relative z-20 px-8 md:px-20 max-w-[90vw] mx-auto">
        {/* Menggunakan flex wrap dengan gap besar untuk menciptakan struktur mosaik kata yang rapat */}
        <div className="flex flex-wrap items-center justify-start gap-x-12 gap-y-8 md:gap-y-10 row-gap">
          {LOVED_THINGS.map((item, i) => {
            const isVisible = i < visibleCount

            return (
              <div
                key={i}
                className="inline-block"
                style={{
                  // Sedikit variasi flex-grow berdasarkan panjang kata agar polanya tidak kaku
                  flexGrow: item.text.length > 25 ? 2 : 1,
                }}
              >
                <AnimatePresence>
                  {isVisible && (
                    <motion.span
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 1, 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="block font-serif text-[#f5f2eb] cursor-default select-none transition-transform duration-300 hover:scale-[1.03]"
                      style={{
                        fontSize: SIZE_MAP[item.size],
                        fontStyle: item.italic ? 'italic' : 'normal',
                        fontWeight: item.size === 'xl' ? 400 : 300,
                        lineHeight: 1.1,
                        letterSpacing: '-0.01em',
                        // Menambahkan koma gantung transparan sebagai pemisah ritme visual jika diinginkan
                        whiteSpace: 'normal',
                      }}
                    >
                      {item.text}
                      <span className="opacity-15 font-sans ml-2 text-sm select-none">/</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}