"use client";

import { useState } from "react";
import HeroScene from "@/components/scenes/HeroScene";
import StoryIntro from "@/components/scenes/StoryIntro";
import GalleryReel from "@/components/scenes/GalleryReel";
import CinematicOverlay from "@/components/CinematicOverlay";
import MusicPlayer from "@/components/MusicPlayer";
import DomeGallery from "@/components/scenes/DomeGallery";
import MemoryWall from "@/components/scenes/MemoryWall";
import ClosingScene from "@/components/scenes/ClosingScene";
import ApologySection from "@/components/scenes/ApologySection";

export default function Home() {
  const [isMusicStarted, setIsMusicStarted] = useState(false);

  return (
    <main>
      {/* 1. Gate Intro / Overlay Screen */}
      {/* <CinematicOverlay onEnter={() => setIsMusicStarted(true)} /> */}

      {/* 2. Audio Controller Instance */}
      <MusicPlayer />

      {/* 3. Main Cinematic Content */}
      {/* Kita beri efek blur tipis/fade di konten utama jika user belum menekan enter (opsional, untuk menambah vibe) */}

      <HeroScene />
      <StoryIntro />
      <GalleryReel />
      <div className="w-full h-screen relative block bg-black">
        <DomeGallery
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale
        />
        <MemoryWall />
        <ApologySection />
        <ClosingScene/>
      </div>
    </main>
  );
}
