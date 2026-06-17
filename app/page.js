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
import ThingsILovedSection from "@/components/scenes/ThingsILovedSection";

export default function Home() {
  const [isMusicStarted, setIsMusicStarted] = useState(false);

  return (
    <main className="bg-black w-full min-h-screen">
      {/* 1. Audio Controller Instance */}
      <MusicPlayer />

      {/* 2. Main Cinematic Content */}
      <HeroScene />
      <StoryIntro />
      <GalleryReel />
      
      {/* DomeGallery dikunci h-screen sendiri agar efek 3D-nya aman */}
      <div className="w-full h-screen relative bg-black">
        <DomeGallery
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale
        />
      </div>

      {/* Seksi sisanya ditaruh berurutan di bawahnya secara bebas */}
      <MemoryWall />
      <ApologySection />
      <ThingsILovedSection />
      <ClosingScene />
    </main>
  );
}
