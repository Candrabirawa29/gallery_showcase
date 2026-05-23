'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CREDITS = [
  { role: 'A film by', name: 'Your Name Here' },
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
      gsap.fromTo(overlayRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: '0% top',
            end: '10% top',
            scrub: 1,
          },
        }
      )

      // ── CLOSING TITLE: setiap kata muncul bergantian ──
      charsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, y: 40, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: `${8 + i * 7}% top`,
              end: `${18 + i * 7}% top`,
              scrub: 0.8,
            },
          }
        )
      })

      // ── DIVIDER LINE ──
      gsap.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 0.25,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: '42% top',
            end: '54% top',
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
            start: '46% top',
            end: '56% top',
            scrub: 0.8,
          },
        }
      )

      // ── CREDITS: muncul satu per satu ──
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
              start: `${55 + i * 8}% top`,
              end: `${63 + i * 8}% top`,
              scrub: 0.7,
            },
          }
        )
      })

      // ── FADE TO BLACK di akhir ──
      gsap.fromTo(finalBlackRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: '88% top',
            end: '100% top',
            scrub: 1,
          },
        }
      )

      // ── Semua konten fade out sebelum black ──
      gsap.to(titleWrapRef.current, {
        opacity: 0,
        y: -30,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: section,
          start: '80% top',
          end: '90% top',
          scrub: 0.8,
        },
      })

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
            004 / Closing
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
                <p className="text-[10px] font-mono tracking-[0.~3em] text-[#f0ede8] opacity-40 uppercase">
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