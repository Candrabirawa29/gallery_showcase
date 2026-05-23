'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroScene() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const ctx = gsap.context(() => {
      // Cinematic exit: fade out + scale down saat scroll keluar
      gsap.to(content, {
        opacity: 0,
        scale: 0.94,
        filter: 'blur(4px)',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Main content */}
      <div ref={contentRef} className="relative z-20 text-center px-6">
        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          animate={{ opacity: 0.4, letterSpacing: '0.5em' }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
          className="text-[11px] uppercase tracking-[0.5em] text-[#f0ede8] mb-8 font-sans"
        >
          A Visual Journey
        </motion.p>

        {/* Main title */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="text-[clamp(3rem,10vw,9rem)] font-serif font-normal leading-none tracking-tight text-[#f0ede8]"
            style={{ fontStyle: 'italic' }}
          >
            Frames of
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
            className="text-[clamp(3rem,10vw,9rem)] font-serif font-normal leading-none tracking-tight text-[#f0ede8]"
          >
            Memory
          </motion.h1>
        </div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.3 }}
          transition={{ duration: 1.6, ease: 'easeInOut', delay: 1.4 }}
          className="w-24 h-px bg-[#f0ede8] mx-auto mb-8 origin-left"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 1.7 }}
          className="text-sm font-sans tracking-widest text-[#f0ede8] font-light"
        >
          Scroll to begin
        </motion.p>

        {/* Scroll indicator dot */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-12 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-[#f0ede8] opacity-40"
          />
        </motion.div>
      </div>
    </section>
  )
}