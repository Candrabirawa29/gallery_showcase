'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CREDITS = [
  { role: 'A film by', name: 'Damar Raditya' },
  { role: 'Photography', name: 'Light & Moment Studio' },
  { role: 'Music', name: 'Silence Between Notes' },
  { role: 'Memory', name: 'Every Frame You\'ve Kept' },
]

const CLOSING_WORDS = ['Every', 'memory', 'is', 'a', 'frame.']

export default function ClosingScene() {
  const sectionRef = useRef(null)
  const pinnedRef = useRef(null)
  const overlayRef = useRef(null)
  const titleWrapRef = useRef(null)
  const charsRef = useRef([])
  const creditsRef = useRef([])
  const dividerRef = useRef(null)
  const finalBlackRef = useRef(null)
  const taglineRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {

      // ── PIN ──
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinnedRef.current,
        pinSpacing: false,
      })

      // ── FADE IN dari hitam saat section masuk ──
      // Durasi diperlama sedikit agar seksi sebelumnya bersih tertutup hitam terlebih dahulu
      gsap.fromTo(overlayRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '15% top', // Dibuat sedikit lebih panjang agar transisi halus
            scrub: 1,
          },
        }
      )

      // ── CLOSING TITLE: batas start digeser mundur agar tidak menabrak ──
      charsRef.current.forEach((el, i) => {
        if (!el) return
        
        // Perubahan Utama: Nilai start digeser dari 8% menjadi dimulai dari 22% 
        // Ini memberikan ruang kosong (buffer ruang hitam) agar teks seksi sebelumnya hilang total
        const startPercent = 22 + i * 6
        const endPercent = startPercent + 10

        gsap.fromTo(el,
          { opacity: 0, y: 40, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: `${startPercent}% top`,
              end: `${endPercent}% top`,
              scrub: 0.8,
            },
          }
        )
      })

      // ── DIVIDER LINE (Disesuaikan mengikuti timeline baru) ──
      gsap.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 0.25,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: '54% top',
            end: '64% top',
            scrub: 1,
          },
        }
      )

      // ── TAGLINE ──
      gsap.fromTo(taglineRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 0.5,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: '58% top',
            end: '68% top',
            scrub: 0.8,
          },
        }
      )

      // ── CREDITS: muncul berurutan secara anggun ──
      creditsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: `${68 + i * 6}% top`,
              end: `${74 + i * 6}% top`,
              scrub: 0.7,
            },
          }
        )
      })

      // ── Semua konten fade out sebelum layar hitam total ──
      gsap.to(titleWrapRef.current, {
        opacity: 0,
        y: -30,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: section,
          start: '88% top',
          end: '94% top',
          scrub: 0.8,
        },
      })

      // ── FADE TO BLACK di akhir ──
      gsap.fromTo(finalBlackRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: '92% top',
            end: '100% top',
            scrub: 1,
          },
        }
      )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '500vh', background: '#0a0a0a' }}
    >
      {/* Pinned viewport */}
      <div
        ref={pinnedRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)',
          }}
        />

        {/* Fade in overlay — hitam yang pergi */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#0a0a0a] z-40 pointer-events-none"
        />

        {/* Final fade to black overlay */}
        <div
          ref={finalBlackRef}
          className="absolute inset-0 bg-[#0a0a0a] z-40 pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Section label */}
        <div className="absolute top-8 left-8 z-30">
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#f0ede8] opacity-30 uppercase">
            007 / Closing
          </p>
        </div>

        {/* Main content */}
        <div
          ref={titleWrapRef}
          className="relative z-20 text-center px-6 w-full max-w-3xl mx-auto"
        >
          {/* Closing title — setiap kata terpisah */}
          <div className="flex flex-wrap justify-center gap-x-[0.35em] gap-y-2 mb-12">
            {CLOSING_WORDS.map((word, i) => (
              <span
                key={i}
                ref={(el) => (charsRef.current[i] = el)}
                className="inline-block text-[clamp(2.4rem,7vw,6rem)] font-serif text-[#f0ede8] leading-tight"
                style={{
                  opacity: 0,
                  fontStyle: i % 2 === 0 ? 'italic' : 'normal',
                  fontWeight: i === 4 ? '400' : '300',
                  letterSpacing: i === 4 ? '0.04em' : '0',
                }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div
            ref={dividerRef}
            className="w-32 h-px bg-[#f0ede8] mx-auto mb-8 origin-center"
            style={{ opacity: 0 }}
          />

          {/* Tagline */}
          <p
            ref={taglineRef}
            className="text-sm font-sans tracking-[0.3em] text-[#f0ede8] uppercase mb-16"
            style={{ opacity: 0 }}
          >
            Thank you for remembering
          </p>

          {/* Credits */}
          <div className="space-y-6">
            {CREDITS.map((credit, i) => (
              <div
                key={i}
                ref={(el) => (creditsRef.current[i] = el)}
                className="flex flex-col items-center gap-1"
                style={{ opacity: 0 }}
              >
                {/* Memperbaiki typo syntax tracking class Tailwind yang rusak sebelumnya */}
                <p className="text-[10px] font-mono tracking-[0.3em] text-[#f0ede8] opacity-40 uppercase">
                  {credit.role}
                </p>
                <p
                  className="text-base font-serif text-[#f0ede8] opacity-80"
                  style={{ fontStyle: 'italic' }}
                >
                  {credit.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Film frame corners — detail sinematik */}
        {[
          'top-6 left-6',
          'top-6 right-6',
          'bottom-6 left-6',
          'bottom-6 right-6',
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} z-20 w-8 h-8 opacity-15`}
            style={{
              borderTop: i < 2 ? '1px solid #f0ede8' : 'none',
              borderBottom: i >= 2 ? '1px solid #f0ede8' : 'none',
              borderLeft: i % 2 === 0 ? '1px solid #f0ede8' : 'none',
              borderRight: i % 2 === 1 ? '1px solid #f0ede8' : 'none',
            }}
          />
        ))}

        {/* Frame number — pojok kanan bawah */}
        <div className="absolute bottom-8 right-8 z-30">
          <p className="text-[10px] font-mono tracking-widest opacity-15 text-[#f0ede8]">
            FIN
          </p>
        </div>
      </div>
    </section>
  )
}