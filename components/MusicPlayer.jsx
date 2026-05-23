"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, X, ListMusic } from 'lucide-react';

// 1. Data Playlist Cinematic (Sediakan file-file ini di /public/music/)
const PLAYLIST = [
  { id: 1, title: "Everything u are", artist: "Hindia", src: "/music/Hindia - everything u are.mp3" },
  { id: 2, title: "Photograph", artist: "Ed Sheeran", src: "/music/Ed Sheeran - Photograph (Official Lyric Video).mp3" },
  { id: 3, title: "Midnight Gallery", artist: "Damar Studio", src: "/music/midnight-gallery.mp3" }
];

const MusicPlayer = ({ isStarted }) => {
  const audioRef = useRef(null);
  
  // Audio & Track States
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(40); // Default 40%
  const [prevVolume, setPrevVolume] = useState(40); // Untuk restore setelah unmute

  // UI States
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // ==========================================
  // CORE AUDIO LOGIC & lifecycle
  // ==========================================
  useEffect(() => {
    audioRef.current = new Audio(currentTrack.src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0; // Mulai dari 0 untuk fade-in pertama

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle ketika user menekan "Enter" pertama kali dari overlay
  useEffect(() => {
    if (isStarted && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          fadeIn(volume / 100);
        })
        .catch(err => console.log("Audio play blocked or interrupted:", err));
    }
  }, [isStarted]);

  // Handle ganti lagu otomatis ketika index track berubah
  useEffect(() => {
    if (!isStarted || !audioRef.current) return;

    // Fade out lagu lama dulu sebelum ganti
    let vol = audioRef.current.volume;
    const fadeOutInterval = setInterval(() => {
      if (vol > 0.05) {
        vol -= 0.05;
        audioRef.current.volume = Math.max(0, vol);
      } else {
        clearInterval(fadeOutInterval);
        
        // Ganti source audio ke lagu baru
        audioRef.current.src = currentTrack.src;
        audioRef.current.load();
        
        if (isPlaying) {
          audioRef.current.play()
            .then(() => fadeIn(volume / 100))
            .catch(err => console.log(err));
        } else {
          audioRef.current.volume = volume / 100;
        }
      }
    }, 20);

  }, [currentTrackIndex]);

  // ==========================================
  // UTILITY FUNCTIONS (Fade, Volume, Controls)
  // ==========================================
  const fadeIn = (targetVolume) => {
    if (!audioRef.current) return;
    let vol = 0;
    audioRef.current.volume = 0;
    const interval = setInterval(() => {
      if (vol < targetVolume) {
        vol += 0.02;
        audioRef.current.volume = Math.min(targetVolume, vol);
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.volume = volume / 100;
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
    }
    if (newVol > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume);
      audioRef.current.volume = prevVolume / 100;
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
      audioRef.current.volume = 0;
    }
  };

  if (!isStarted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans select-none">
      
      {/* ==========================================
          PANEL UTAMA (EXPANDED CONTROL) 
         ========================================== */}
      {isExpanded && (
        <div className="w-80 md:w-96 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-2xl transition-all duration-500 ease-out animate-fade-in-up">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className=" translate-x-1 text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium mr-3">Now Playing</span>
            <div className="flex items-center gap-2 -translate-x-1">
              <button 
                onClick={() => setShowPlaylist(!showPlaylist)} 
                className={`p-1.5 rounded-lg transition-colors ${showPlaylist ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
              >
                <ListMusic size={16} />
              </button>
              <button onClick={() => setIsExpanded(false)} className="text-white/40 hover:text-white p-1.5 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Kondisi: Tampilan Utama Player vs Daftar Playlist */}
          {!showPlaylist ? (
            <div className="flex flex-col items-center text-center py-2">
              {/* Mini Vinyl Spin di dalam Panel */}
              <div className={`mb-4 relative rounded-full p-2 border border-white/5 bg-white/5 ${isPlaying && !isMuted ? 'animate-spin-slow' : 'opacity-40'}`}>
                <Disc size={64} className="text-white/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#0a0a0a] border border-white/20" />
                </div>
              </div>

              {/* Info Lagu */}
              <h3 className="text-sm font-light tracking-wide text-white max-w-full truncate px-4">{currentTrack.title}</h3>
              <p className="text-xs text-white/40 mt-1 font-light tracking-wider">{currentTrack.artist}</p>

              {/* Kontrol Navigasi Musik */}
              <div className="flex items-center gap-6 mt-6">
                <button onClick={handlePrev} className="text-white/60 hover:text-white transition-colors active:scale-90">
                  <SkipBack size={18} fill="currentColor" className="opacity-80" />
                </button>
                <button 
                  onClick={handlePlayPause} 
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                <button onClick={handleNext} className="text-white/60 hover:text-white transition-colors active:scale-90">
                  <SkipForward size={18} fill="currentColor" className="opacity-80" />
                </button>
              </div>
            </div>
          ) : (
            /* Tampilan Playlist */
            <div className="flex flex-col gap-1 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
              {PLAYLIST.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setShowPlaylist(false);
                  }}
                  className={`flex items-center justify-between text-left p-2.5 rounded-xl transition-all ${
                    idx === currentTrackIndex 
                      ? 'bg-white/10 text-white font-normal' 
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="truncate max-w-[80%]">
                    <p className="text-xs tracking-wide truncate">{track.title}</p>
                    <p className="text-[10px] text-white/30 truncate mt-0.5">{track.artist}</p>
                  </div>
                  {idx === currentTrackIndex && isPlaying && <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />}
                </button>
              ))}
            </div>
          )}

          {/* Slider Volume ala Spotify */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
            <button onClick={toggleMute} className="text-white/50 hover:text-white transition-colors translate-x-1">
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-white/90 transition-all [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <span className="text-[10px] text-white/30 min-w-[20px] text-right">{volume}%</span>
          </div>

        </div>
      )}

      {/* ==========================================
          TRIGGER TRIGGER BUTTON (THE VINYL LOGO)
         ========================================== */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:scale-105 active:scale-95 shadow-lg"
        >
          {/* Subtle Outer Pulse Glow */}
          {isPlaying && !isMuted && (
            <span className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-40 pointer-events-none" />
          )}

          {/* Vinyl Disc Icon (Muter-muter) */}
          <div className={`${isPlaying && !isMuted ? 'animate-spin-slow' : 'opacity-60'}`}>
            <Disc size={24} className="text-white transition-transform group-hover:scale-110" />
          </div>

          {/* Center Hole Vinyl Indicator */}
          <div className="absolute w-1.5 h-1.5 rounded-full bg-black border border-white/40" />
        </button>
      )}

      {/* Embedded Style CSS untuk Animasi Kustom */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 212, 212, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;