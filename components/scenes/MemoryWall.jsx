"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// EDIT DI SINI untuk tambah / kurangi foto
//
// enter: posisi muncul relatif dari center
//   { x: '8vw',  y: '0vh'  } → tengah kanan
//   { x: '-8vw', y: '0vh'  } → tengah kiri
//   { x: '0vw',  y: '4vh'  } → tengah bawah sedikit
//
// exit: arah foto pergi
//   { x: '40vw',  y: '-8vh'  } → kanan atas
//   { x: '-40vw', y: '-8vh'  } → kiri atas
//   { x: '0vw',   y: '-50vh' } → lurus ke atas
// ─────────────────────────────────────────────
const MEMORIES = [
  {
    id: "01",
    src: "/images/wall-01.jpg",
    rotation: "-1.5deg",
    enter: { x: "6vw", y: "2vh" },
    exit: { x: "42vw", y: "-10vh" },
  },
  {
    id: "02",
    src: "/images/wall-02.jpg",
    rotation: "1.2deg",
    enter: { x: "-7vw", y: "-2vh" },
    exit: { x: "-44vw", y: "-8vh" },
  },
  {
    id: "03",
    src: "/images/wall-03.jpg",
    rotation: "-0.8deg",
    enter: { x: "4vw", y: "3vh" },
    exit: { x: "10vw", y: "-52vh" },
  },
  {
    id: "04",
    src: "/images/wall-04.jpg",
    rotation: "2deg",
    enter: { x: "-5vw", y: "-1vh" },
    exit: { x: "-38vw", y: "-14vh" },
  },
  {
    id: "05",
    src: "/images/wall-05.jpg",
    rotation: "-1.2deg",
    enter: { x: "8vw", y: "1vh" },
    exit: { x: "46vw", y: "-6vh" },
  },
  {
    id: "06",
    src: "/images/wall-06.jpg",
    rotation: "0.8deg",
    enter: { x: "-6vw", y: "2vh" },
    exit: { x: "-12vw", y: "-54vh" },
  },
  {
    id: "07",
    src: "/images/wall-07.jpg",
    rotation: "-2deg",
    enter: { x: "5vw", y: "-3vh" },
    exit: { x: "40vw", y: "-12vh" },
  },
  {
    id: "08",
    src: "/images/wall-08.jpg",
    rotation: "1.5deg",
    enter: { x: "-8vw", y: "0vh" },
    exit: { x: "-42vw", y: "-10vh" },
  },
  {
    id: "09",
    src: "/images/wall-09.jpg",
    rotation: "-0.6deg",
    enter: { x: "3vw", y: "2vh" },
    exit: { x: "8vw", y: "-50vh" },
  },
  {
    id: "10",
    src: "/images/wall-10.jpg",
    rotation: "1.8deg",
    enter: { x: "-4vw", y: "-2vh" },
    exit: { x: "-36vw", y: "-16vh" },
  },
];

// ─────────────────────────────────────────────
// TUNING ANIMASI
// Naikkan SCROLL_PER_MEMORY untuk lebih lambat
// Turunkan untuk lebih cepat
const SCROLL_PER_MEMORY = 60; // dalam vh per foto
// Seberapa banyak overlap (0.0 - 0.5)
// 0.3 = foto baru muncul saat foto lama 70% selesai exit
const OVERLAP_RATIO = 0.32;
// ─────────────────────────────────────────────

export default function MemoryWall() {
  const sectionRef = useRef(null);
  const pinnedRef = useRef(null);
  const headingLineRef = useRef([]);
  const cardsRef = useRef([]);
  const bgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const totalScroll = MEMORIES.length * SCROLL_PER_MEMORY;

    // helper: scroll position dalam % dari section height
    const pct = (vh) => (vh / totalScroll) * 100;

    const ctx = gsap.context(() => {
      // ── PIN ──
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: pinnedRef.current,
        pinSpacing: false,
      });

      // ── HEADING reveal ──
      headingLineRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: "105%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: `${pct(i * 8)}% top`,
              end: `${pct(i * 8 + 14)}% top`,
              scrub: 0.5,
            },
          },
        );
      });

      // ── FOTO animasi ──
      MEMORIES.forEach((memory, i) => {
        const card = cardsRef.current[i];
        if (!card) return;

        // Titik scroll absolut (dalam vh) untuk foto ini
        const enterVh = i * SCROLL_PER_MEMORY;
        const peakVh = enterVh + SCROLL_PER_MEMORY * 0.22;
        const exitStartVh = enterVh + SCROLL_PER_MEMORY * 0.4;
        const exitEndVh = enterVh + SCROLL_PER_MEMORY * 0.75;

        // Foto berikutnya mulai enter sebelum foto ini selesai exit (overlap)
        // Sudah otomatis karena enterVh foto [i+1] = exitStartVh foto [i] - overlap

        const startVh = i * SCROLL_PER_MEMORY * (1 - OVERLAP_RATIO)
const endVh = startVh + SCROLL_PER_MEMORY

const { x: ex, y: ey } = memory.exit
const { x: nx, y: ny } = memory.enter

gsap.fromTo(
  card,
  {
    opacity: 0,
    scale: 0.55,
    x: nx,
    y: ny,
    rotation: parseFloat(memory.rotation) * 1.5,
  },
  {
    opacity: 0,
    scale: 1.08,
    x: ex,
    y: ey,
    rotation: parseFloat(memory.rotation),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: `${pct(startVh)}% top`,
      end: `${pct(endVh)}% top`,
      scrub: true,
    },

    // opacity cinematic
    onUpdate: function () {
      const p = this.progress()

      let opacity = 0

      if (p < 0.2) {
        opacity = p / 0.2
      } else if (p > 0.7) {
        opacity = 1 - (p - 0.7) / 0.3
      } else {
        opacity = 1
      }

      gsap.set(card, { opacity })
    },
  }
)
       
      });

      // ── Background color shift ──
      const bgColors = ["#110e0a", "#0a0a10", "#0d0b0e", "#0a0e0a", "#0e0e0a"];
      MEMORIES.forEach((_, i) => {
        if (i === 0) return;
        const startVh = i * SCROLL_PER_MEMORY;
        gsap.to(bgRef.current, {
          backgroundColor: bgColors[i % bgColors.length],
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: `${pct(startVh)}% top`,
            end: `${pct(startVh + SCROLL_PER_MEMORY * 0.25)}% top`,
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Total section height = ruang scroll yang dibutuhkan
  const sectionHeight = MEMORIES.length * SCROLL_PER_MEMORY;

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${sectionHeight}vh` }}
    >
      <div
        ref={pinnedRef}
        className="sticky top-0 w-full h-screen overflow-hidden"
      >
        {/* Background */}
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{ backgroundColor: "#110e0a" }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.78) 100%)",
          }}
        />

        {/* ── HEADING ── */}
        <div
          className="absolute top-0 left-0 right-0 z-30 pt-10 pb-6 px-8"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.95) 55%, transparent 100%)",
          }}
        >
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#f0ede8] opacity-30 uppercase mb-4">
            003 / Memory Wall
          </p>

          <div className="overflow-hidden">
            <div
              ref={(el) => (headingLineRef.current[0] = el)}
              style={{ transform: "translateY(105%)", opacity: 0 }}
            >
              <h2
                className="font-serif text-[#f0ede8] leading-none"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 7rem)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                Fragments of
              </h2>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              ref={(el) => (headingLineRef.current[1] = el)}
              style={{ transform: "translateY(105%)", opacity: 0 }}
            >
              <h2
                className="font-serif text-[#f0ede8] leading-none"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 7rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                Memory
              </h2>
            </div>
          </div>
        </div>

        {/* ── FOTO STACK ── */}
        {MEMORIES.map((memory, i) => (
          <div
            key={memory.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className="absolute z-20"
            style={{
              top: "50%",
              left: "50%",
              // base transform — GSAP akan override x/y via px,
              // rotation dihandle GSAP juga
              transform: `translate(-50%, -46%)`,
              width: "clamp(220px, 30vw, 420px)",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            {/* Polaroid — tanpa caption */}
            <div
              className="bg-[#f5f0e8] p-3 pb-5"
              style={{
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={memory.src}
                  alt={`Memory ${memory.id}`}
                  fill
                  className="object-cover"
                  style={{ filter: "brightness(0.88) saturate(0.82)" }}
                  sizes="(max-width: 768px) 80vw, 420px"
                />
              </div>
            </div>

            {/* Selotip */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-5 opacity-55"
              style={{ background: "rgba(240,220,160,0.75)" }}
            />
          </div>
        ))}

        {/* Counter foto */}
        <div className="absolute bottom-8 right-8 z-30">
          <p className="text-[10px] font-mono tracking-widest text-[#f0ede8] opacity-20">
            {MEMORIES.length} FRAMES
          </p>
        </div>
      </div>
    </section>
  );
}
