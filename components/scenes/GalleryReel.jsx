'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAMES = [
  { id: '001', src: '/images/gallery-01.jpg', title: 'Where It All Started', sub: "Liat crush maen roblox, lgsg pen download bjir, satu satunya alasan download roblox waktu itu (●'◡'●)" },
  { id: '002', src: '/images/gallery-02.jpg', title: 'Beneath The Northern Sky', sub: 'Akhirnya bisa mabar bareng bersama, seneng bangetttttttttttttttttttttttttttttttttttttttttttttttttttttttt☆*: .｡. o(≧▽≦)o .｡.:*☆!' },
  { id: '003', src: '/images/gallery-03.jpg', title: 'Fear Was Never The Problem', sub: 'Boong jir, aku tetep takut main di map horor, tapi di rl aku ga takut ya!, kalo ketemu aku pukul (╯‵□′)╯︵┻━┻' },
  { id: '004', src: '/images/gallery-04.jpg', title: 'Open Field', sub: 'Where silence grows' },
  { id: '005', src: '/images/gallery-05.jpg', title: 'Fading Blue', sub: 'The hour between' },
]

export default function GalleryReel() {
  const sectionRef = useRef(null)
  const pinnedRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      // Total jarak geser horizontal
      const totalScroll = track.scrollWidth - window.innerWidth

      // ── HORIZONTAL SCROLL utama ──
      const horizontalTween = gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            // Update progress bar
            if (progressRef.current) {
              progressRef.current.style.scaleX = self.progress
            }
          },
        },
      })

      // ── PARALLAX pada setiap gambar di dalam kartu ──
      cardsRef.current.forEach((card) => {
        if (!card) return
        const img = card.querySelector('.parallax-img')
        if (!img) return

        gsap.fromTo(img,
          { x: '-8%' },
          {
            x: '8%',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
            },
          }
        )
      })

      // ── SCALE + FADE setiap kartu saat masuk/keluar ──
      cardsRef.current.forEach((card, i) => {
        if (!card) return

        // Kartu pertama sudah visible
        if (i === 0) return

        gsap.fromTo(card,
          { opacity: 0.3, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              containerAnimation: horizontalTween,
              trigger: card,
              start: 'left 85%',
              end: 'left 40%',
              scrub: true,
            },
          }
        )
      })

      // ── TITLE REVEAL setiap kartu ──
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        const titleEl = card.querySelector('.card-title')
        const subEl = card.querySelector('.card-sub')
        if (!titleEl) return

        gsap.fromTo(
          [titleEl, subEl].filter(Boolean),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              containerAnimation: horizontalTween,
              trigger: card,
              start: 'left 60%',
              end: 'left 20%',
              scrub: true,
            },
          }
        )
      })

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '600vh', background: '#0a0a0a' }}
    >
      {/* Pinned viewport */}
      <div
        ref={pinnedRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center"
      >
        {/* Section label */}
        <div className="absolute top-8 left-8 z-20">
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#f0ede8] opacity-30 uppercase">
            002 / Gallery Reel
          </p>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-[#f0ede8]/10">
          <div
            ref={progressRef}
            className="h-full bg-[#f0ede8]/50 origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex items-center gap-6 px-[10vw] will-change-transform"
          style={{ width: 'max-content' }}
        >
          {FRAMES.map((frame, i) => (
            <div
              key={frame.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className="relative flex-shrink-0 group"
              style={{
                width: 'clamp(280px, 38vw, 560px)',
                height: 'clamp(360px, 65vh, 700px)',
              }}
            >
              {/* Foto */}
              <div className="relative w-full h-full overflow-hidden">
                <div
                  className="parallax-img absolute inset-0 w-[116%] h-full -left-[8%]"
                  style={{ willChange: 'transform' }}
                >
                  <Image
                    src={frame.src}
                    alt={frame.title}
                    fill
                    className="object-cover"
                    style={{
                      filter: 'brightness(0.75) sepia(0.15)',
                    }}
                    sizes="(max-width: 768px) 80vw, 560px"
                  />
                </div>

                {/* Gradient overlay bawah */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 50%)',
                  }}
                />

                {/* Vignette tepi */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.4) 100%)',
                  }}
                />
              </div>

              {/* Teks info kartu */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
                <p className="text-[10px] font-mono tracking-[0.3em] text-[#f0ede8] opacity-40 mb-3">
                  {frame.id}
                </p>
                <h3
                  className="card-title text-[clamp(1.4rem,3vw,2.2rem)] font-serif text-[#f0ede8] leading-tight mb-2"
                  style={{ fontStyle: 'italic' }}
                >
                  {frame.title}
                </h3>
                <p className="card-sub text-xs font-sans tracking-widest text-[#f0ede8] opacity-50 ">
                  {frame.sub}
                </p>
              </div>

              {/* Border frame sinematik */}
              <div
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 0 1px rgba(240,237,232,0.08)',
                }}
              />
            </div>
          ))}

          {/* End card — breathing room */}
          <div
            className="flex-shrink-0 flex items-center justify-center opacity-20"
            style={{ width: '20vw' }}
          >
            <div className="text-center">
              <div className="w-px h-16 bg-[#f0ede8] mx-auto mb-4" />
              <p className="text-[10px] font-mono tracking-widest text-[#f0ede8] uppercase">
                End of Reel
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}