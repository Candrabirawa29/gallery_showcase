'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINES = [
  'Some moments refuse to fade.',
  'They live in the light between frames —',
  'in the breath before a shutter clicks.',
  'This is where memory becomes image.',
]

export default function StoryIntro() {
  const sectionRef = useRef(null)
  const pinnedRef = useRef(null)
  const linesRef = useRef([])
  const img1Ref = useRef(null)
  const img2Ref = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {

      // ── PIN the inner content while scroll happens ──
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinnedRef.current,
        pinSpacing: false,
      })

      // ── TEKS: reveal setiap baris berbasis scroll ──
      linesRef.current.forEach((line, i) => {
        if (!line) return
        gsap.fromTo(line,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: `${10 + i * 18}% top`,
              end: `${22 + i * 18}% top`,
              scrub: 0.8,
            },
          }
        )

        // Fade out teks saat mendekati akhir section
        gsap.to(line, {
          opacity: 0,
          y: -20,
          scrollTrigger: {
            trigger: section,
            start: '72% top',
            end: '88% top',
            scrub: 0.6,
          },
        })
      })

      // ── GAMBAR 1: muncul di tengah scroll, lalu menembus layar ──
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: '15% top',
          end: '52% top',
          scrub: 1,
        },
      })
      tl1
        .fromTo(img1Ref.current,
          { opacity: 0, scale: 0.28, filter: 'blur(12px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 0.5 }
        )
        .to(img1Ref.current,
          { opacity: 0, scale: 1.75, filter: 'blur(8px)', ease: 'power2.in', duration: 0.5 }
        )

      // ── GAMBAR 2: muncul lebih lambat, pergi ke arah berbeda ──
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: '48% top',
          end: '85% top',
          scrub: 1,
        },
      })
      tl2
        .fromTo(img2Ref.current,
          { opacity: 0, scale: 0.2, filter: 'blur(16px)', y: 40 },
          { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, ease: 'power2.out', duration: 0.5 }
        )
        .to(img2Ref.current,
          { opacity: 0, scale: 1.6, filter: 'blur(10px)', y: -30, ease: 'power2.in', duration: 0.5 }
        )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    // Tinggi section = ruang scroll (4x viewport)
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '400vh', background: '#0a0a0a' }}
    >
      {/* Pinned viewport — ini yang tetap diam saat scroll */}
      <div
        ref={pinnedRef}
        className="w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ position: 'sticky', top: 0 }}
      >
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 20%, rgba(10,10,10,0.9) 100%)',
          }}
        />

        {/* Gambar 1 — center stage */}
        <div
          ref={img1Ref}
          className="absolute z-0"
          style={{
            width: 'min(520px, 80vw)',
            aspectRatio: '3/2',
            opacity: 0,
            willChange: 'transform, opacity, filter',
          }}
        >
          <Image
            src="/images/memory-01.jpg"
            alt="Memory one"
            fill
            className="object-cover"
            style={{ filter: 'sepia(0.3) brightness(0.85)' }}
            sizes="(max-width: 768px) 80vw, 520px"
            priority
          />
          {/* Inner vignette pada gambar */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.6) 100%)',
            }}
          />
        </div>

        {/* Gambar 2 — sedikit offset */}
        <div
          ref={img2Ref}
          className="absolute z-0"
          style={{
            width: 'min(480px, 75vw)',
            aspectRatio: '4/3',
            opacity: 0,
            willChange: 'transform, opacity, filter',
          }}
        >
          <Image
            src="/images/memory-02.jpg"
            alt="Memory two"
            fill
            className="object-cover"
            style={{ filter: 'sepia(0.2) brightness(0.8)' }}
            sizes="(max-width: 768px) 75vw, 480px"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.6) 100%)',
            }}
          />
        </div>

        {/* Teks narasi — z lebih tinggi dari gambar */}
        <div className="relative z-20 text-center px-6 max-w-2xl mx-auto">
          {LINES.map((line, i) => (
            <div key={i} className="overflow-hidden mb-2">
              <p
                ref={(el) => (linesRef.current[i] = el)}
                className="text-[clamp(1.1rem,3vw,1.75rem)] font-serif leading-relaxed text-[#f0ede8]"
                style={{
                  opacity: 0,
                  fontStyle: i % 2 === 1 ? 'italic' : 'normal',
                  letterSpacing: '0.02em',
                }}
              >
                {line}
              </p>
            </div>
          ))}
        </div>

        {/* Frame counter — detail sinematik */}
        <div className="absolute bottom-8 right-8 z-20 text-right">
          <p
            className="text-[10px] font-mono tracking-widest opacity-20 text-[#f0ede8]"
          >
            001 / INTRO
          </p>
        </div>
      </div>
    </section>
  )
}