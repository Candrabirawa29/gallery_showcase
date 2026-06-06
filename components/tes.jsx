"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Repeat, Disc, X, ListMusic } from 'lucide-react';

// 1. Data Playlist Cinematic (Pastikan file ada di /public/music/)
const PLAYLIST = [
  { id: 1, title: "Everything u are", artist: "Hindia", src: "/music/Hindia - everything u are.mp3" },
  { id: 2, title: "Photograph", artist: "Ed Sheeran", src: "/music/Ed Sheeran - Photograph (Official Lyric Video).mp3" },
  { id: 3, title: "Midnight Gallery", artist: "Damar Studio", src: "/music/midnight-gallery.mp3" }
];

const MusicPlayer = () => {
  const audioRef = useRef(null);
  
  // Audio & Track States
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  // Progress & Duration States
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // UI States (Otomatis terbuka di awal agar tidak mengganggu landing)
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // ==========================================
  // INITIALIZATION & EVENT LISTENERS
  // ==========================================
  useEffect(() => {
    // Inisialisasi object audio pertama kali
    audioRef.current = new Audio(currentTrack.src);
    audioRef.current.volume = 0.4; // Atur volume nyaman (40%) secara permanen di background

    // Pasang listener untuk sinkronisasi durasi dan auto-next
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleAudioEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(err => console.log(err));
      } else {
        handleNext(); // Otomatis lanjut ke lagu berikutnya
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Handle pergantian track (Next/Prev/Playlist Click) dengan Efek Cinematic Fade
  useEffect(() => {
    if (!audioRef.current) return;

    // Fade out lagu lama terlebih dahulu sebelum switch src
    let vol = audioRef.current.volume;
    const fadeOutInterval = setInterval(() => {
      if (vol > 0.05) {
        vol -= 0.05;
        audioRef.current.volume = Math.max(0, vol);
      } else {
        clearInterval(fadeOutInterval);
        
        // Ganti file musik
        audioRef.current.src = currentTrack.src;
        audioRef.current.load();
        setCurrentTime(0);

        if (isPlaying) {
          audioRef.current.play()
            .then(() => fadeIn(0.4))
            .catch(err => {
              // Menangani restriksi browser jika user belum berinteraksi sama sekali
              console.log("Autoplay ditolak browser, menunggu interaksi user klik Play.", err);
              setIsPlaying(false);
            });
        } else {
          audioRef.current.volume = 0.4;
        }
      }
    }, 20);

  }, [currentTrackIndex]);

  // ==========================================
  // AUDIO CONTROLLER FUNCTIONS
  // ==========================================
  const fadeIn = (targetVolume) => {
    if (!audioRef.current) return;
    let vol = 0;
    audioRef.current.volume = 0;
    const interval = setInterval(() => {
      if (vol < targetVolume) {
        vol += 0.04;
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
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          // Jika lagu berada di awal (detik 0), berikan efek fade-in halus
          if (audioRef.current.currentTime < 1) fadeIn(0.4);
        })
        .catch(err => console.log("Gagal memutar audio:", err));
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Helper format detik mentah menjadi string mm:ss (Contoh: 185 -> 03:05)
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans select-none">
      
      {/* ==========================================
          PANEL CONTROL UTAMA (EXPANDED)
         ========================================== */}
      {isExpanded && (
        <div className="w-85 md:w-96 overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5 shadow-2xl transition-all duration-500 ease-out animate-fade-in-up">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="translate-x-1 text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Cinematic Audio</span>
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

          {/* Kondisi: Tampilan Player vs Tampilan Playlist */}
          {!showPlaylist ? (
            <div className="flex flex-col items-center text-center py-2">
              
              {/* Vinyl Animation */}
              <div className={`mb-4 relative rounded-full p-2 border border-white/5 bg-white/5 ${isPlaying ? 'animate-spin-slow' : 'opacity-40'}`}>
                <Disc size={64} className="text-white/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#0a0a0a] border border-white/20" />
                </div>
              </div>

              {/* Info Detail Judul & Musisi */}
              <h3 className="text-sm font-light tracking-wide text-white max-w-full truncate px-4">{currentTrack.title}</h3>
              <p className="text-xs text-white/40 mt-1 font-light tracking-wider">{currentTrack.artist}</p>

              {/* Tombol Kontrol Navigasi Utama */}
              <div className="flex items-center gap-6 mt-6">
                {/* Button Repeat Toggle */}
                <button 
                  onClick={() => setIsRepeat(!isRepeat)} 
                  className={`transition-colors active:scale-90 ${isRepeat ? 'text-orange-400' : 'text-white/40 hover:text-white'}`}
                  title={isRepeat ? "Repeat On" : "Repeat Off"}
                >
                  <Repeat size={16} />
                </button>

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

                {/* Dummy placeholder spacer agar seimbang dengan posisi tombol repeat */}
                <div className="w-4 h-4 invisible" />
              </div>
            </div>
          ) : (
            /* Tampilan Menu Playlist */
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
                  <div className="truncate max-w-[85%]">
                    <p className="text-xs tracking-wide truncate">{track.title}</p>
                    <p className="text-[10px] text-white/30 truncate mt-0.5">{track.artist}</p>
                  </div>
                  {idx === currentTrackIndex && isPlaying && <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />}
                </button>
              ))}
            </div>
          )}

          {/* ==========================================
              SLIDER TIMELINE DURASI (FUNGSI SEEKING)
             ========================================== */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-white/90 transition-all [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <div className="flex justify-between items-center text-[10px] text-white/30 mt-2 tracking-wider px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

        </div>
      )}

      {/* ==========================================
          MINIMIZED FLOATING BUTTON (THE VINYL LOGO)
         ========================================== */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:scale-105 active:scale-95 shadow-lg"
        >
          {isPlaying && (
            <span className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-40 pointer-events-none" />
          )}

          <div className={isPlaying ? 'animate-spin-slow' : 'opacity-60'}>
            <Disc size={24} className="text-white transition-transform group-hover:scale-110" />
          </div>

          <div className="absolute w-1.5 h-1.5 rounded-full bg-black border border-white/40" />
        </button>
      )}

      {/* Stylesheet Scope Animasi */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
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
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;