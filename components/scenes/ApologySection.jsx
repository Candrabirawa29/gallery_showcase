'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const APOLOGIES = [
  { text: 'not listening enough',                  size: 'lg' },
  { text: 'being selfish',                         size: 'lg' },
  { text: 'letting my ego win',                    size: 'md' },
  { text: 'not understanding you',                 size: 'md' },
  { text: 'the moments I wasn\'t there',             size: 'lg' },
  { text: 'thinking there would always be more time',size: 'xl' },
  { text: 'being jealous',                         size: 'lg' },
  { text: 'ghosting you',                            size: 'lg' },
  { text: 'being too demanding',                     size: 'md' },
  { text: 'acting childishly',                       size: 'lg' },
  { text: 'all the empty promises "nanti", "tar", "kapan-kapan"', size: 'xl' },
]

// Font Size yang jauh lebih besar untuk Desktop/Laptop
const SIZE_MAP = {
  sm: 'clamp(1rem, 1.2vw, 1.3rem)',
  md: 'clamp(1.2rem, 1.8vw, 1.8rem)',
  lg: 'clamp(1.6rem, 2.8vw, 2.8rem)',
  xl: 'clamp(2rem, 4vw, 4.2rem)',
}

// Posisi yang dirapatkan agar gap atas-bawah tidak terlalu jauh
// Menggunakan koordinat yang lebih "center-focused" untuk laptop
const SCATTER_POSITIONS = [
  { top: 15, left: 10,  italic: true  },
  { top: 18, left: 55,  italic: true  },
  { top: 30, left: 15,  italic: false },
  { top: 32, left: 60,  italic: true  },
  { top: 42, left: 8,   italic: false },
  { top: 44, left: 45,  italic: true  }, // Kalimat XL Tengah
  { top: 60, left: 12,  italic: false },
  { top: 62, left: 70,  italic: true  },
  { top: 72, left: 35,  italic: false },
  { top: 78, left: 10,  italic: true  },
  { top: 82, left: 40,  italic: false }, // Kalimat XL Bawah
]

const DELAY_PER_ITEM = 0.85

export default function ApologySection() {
  const sectionRef = useRef(null)
  const hasStarted = useRef(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const [showConclusion, setShowConclusion] = useState(false)
  const timeoutsRef = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        once: true,
        onEnter: () => {
          if (hasStarted.current) return
          hasStarted.current = true
          startSequence()
        },
      })
    }, section)

    return () => {
      ctx.revert()
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  function startSequence() {
    APOLOGIES.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1)
        if (i === APOLOGIES.length - 1) {
          const endTimer = setTimeout(() => setShowConclusion(true), 1200)
          timeoutsRef.current.push(endTimer)
        }
      }, 500 + i * (DELAY_PER_ITEM * 1000))
      timeoutsRef.current.push(t)
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '120vh', // Sedikit lebih pendek agar konten terasa lebih padat
        background: '#0a0a0a',
      }}
    >
      {/* Overlay gradien untuk kedalaman visual */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Header Section */}
      <div className="relative z-30 pt-16 px-8 md:px-20">
        <p className="text-[11px] font-mono tracking-[0.4em] text-[#f0ede8] opacity-20 uppercase mb-4">
          005 / Confession
        </p>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[#f0ede8] font-light italic leading-[0.9]"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          I'm Sorry For<span className="opacity-30">...</span>
        </motion.h2>
      </div>

     {/* Main Scatter Area */}
<div className="relative z-20 w-full h-[90vh] mt-[-5vh]">
  {APOLOGIES.map((apology, i) => {
    const pos = SCATTER_POSITIONS[i]
    const isVisible = i < visibleCount

    return (
      <AnimatePresence key={i}>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
            animate={{ 
              // ── UBAH DI SINI ──
              // Buat semua teks langsung solid/terang (0.9 atau 1) tanpa memandang ukuran
              opacity: 0.9, 
              y: 0, 
              filter: 'blur(0px)' 
            }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute cursor-default group"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              maxWidth: '55vw',
            }}
          >
            <p
              // `group-hover:opacity-100` bisa tetap dibiarkan atau dihapus karena dasarnya sudah terang
              className="font-serif text-[#f0ede8] transition-all duration-500 group-hover:translate-x-2"
              style={{
                fontSize: SIZE_MAP[apology.size],
                fontStyle: pos.italic ? 'italic' : 'normal',
                fontWeight: apology.size === 'xl' ? 400 : 300,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {apology.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    )
  })}
</div>
    </section>
  )
}