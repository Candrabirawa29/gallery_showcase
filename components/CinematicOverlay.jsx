"use client";

import React, { useEffect, useState } from 'react';

const CinematicOverlay = ({ onEnter }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  // Handle interaksi via tombol Keyboard "Enter"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !isFading) {
        handleStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFading]);

  const handleStart = () => {
    setIsFading(true);
    // Berikan waktu untuk animasi fade-out screen selesai (1 detik)
    setTimeout(() => {
      setIsVisible(false);
      onEnter(); // Picu audio di parent component
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cinematic Vignette Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-4">
        <h1 className="text-xs uppercase tracking-[0.4em] text-white/40 font-light">
          Cinematic Gallery Experience
        </h1>
        
        <p className="text-sm text-white/60 font-light tracking-wide max-w-sm leading-relaxed">
          For the most immersive experience, please turn on your audio.
        </p>

        {/* Enter Button */}
        <button
          onClick={handleStart}
          className="group mt-8 relative px-8 py-3 overflow-hidden rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10 active:scale-98"
        >
          {/* Subtle line pulse animation */}
          <span className="relative z-10 text-xs uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors">
            Press Enter to Explore
          </span>
        </button>

        {/* Desktop Hint */}
        <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-white/20 mt-2">
          or press <kbd className="border border-white/10 px-1.5 py-0.5 rounded bg-white/5 text-white/40">↵ Enter</kbd> on keyboard
        </span>
      </div>
    </div>
  );
};

export default CinematicOverlay;