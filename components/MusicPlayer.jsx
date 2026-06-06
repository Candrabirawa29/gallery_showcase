"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc, X, ListMusic, Repeat } from 'lucide-react';

const PLAYLIST = [
  { id: 1, title: "Rindu Sendiri", artist: "Iqbaal Ramadhan", src: "/music/Iqbaal Ramadhan - Rindu Sendiri (Lirik Video).mp3" },
  { id: 2, title: "Bimbang", artist: "Melly Goeslaw", src: "/music/Bimbang (Remastered 2024).mp3" },
  { id: 3, title: "Photograph", artist: "Ed Sheeran", src: "/music/Ed Sheeran - Photograph (Official Lyric Video).mp3" },
  { id: 4, title: "Lalu Biru", artist: "Eleanor Whisper", src: "/music/Eleanor Whisper - Lalu Biru (Lyric Video).mp3" },
  { id: 5, title: "Who Knows", artist: "Daniel Caesar", src: "/music/Daniel Caesar - Who Knows (Official Lyric Video).mp3" },
  { id: 6, title: "A Sorrowful Reunion", artist: "Reality Club", src: "/music/A Sorrowful Reunion - Reality Club (Official Lyric Video).mp3" },
];

const MusicPlayer = () => {
  const audioRef = useRef(null);
  // Ref tambahan untuk nyimpen status repeat tanpa re-render audio
  const isRepeatRef = useRef(false); 
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Sync state repeat ke Ref
  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  useEffect(() => {
    // Inisialisasi audio hanya sekali per lagu
    const audio = new Audio(currentTrack.src);
    audioRef.current = audio;
    audio.volume = 0.5;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    
    const handleAudioEnded = () => {
      // Pake Ref biar dapet nilai terbaru tanpa restart useEffect
      if (isRepeatRef.current) {
        audio.currentTime = 0;
        audio.play().catch(err => console.log(err));
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleAudioEnded);

    // Auto play jika sedang mode playing saat ganti lagu
    if (isPlaying) {
      audio.play().catch(err => console.log("Autoplay blocked:", err));
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [currentTrackIndex]); // HANYA re-run kalau track berubah

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log(err));
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans select-none">
      {isExpanded && (
        <div className="w-80 md:w-96 overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-5 shadow-2xl transition-all duration-500 ease-out animate-fade-in-up">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="translate-x-1 text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
              {!isPlaying ? "Ready to Explore" : "Now Playing"}
            </span>
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

          {!showPlaylist ? (
            <div className="flex flex-col items-center text-center py-2">
              <div className={`mb-4 relative rounded-full p-2 border border-white/5 bg-white/5 transition-opacity ${isPlaying ? 'animate-spin-slow' : 'opacity-40'}`}>
                <Disc size={64} className="text-white/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#0a0a0a] border border-white/20" />
                </div>
              </div>

              <h3 className="text-sm font-light tracking-wide text-white max-w-full truncate px-4">{currentTrack.title}</h3>
              <p className="text-xs text-white/40 mt-1 font-light tracking-wider">{currentTrack.artist}</p>

              <div className="flex items-center gap-6 mt-6">
                <button 
                  onClick={() => setIsRepeat(!isRepeat)} 
                  className={`transition-colors active:scale-90 ${isRepeat ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]' : 'text-white/30 hover:text-white/60'}`}
                >
                  <Repeat size={16} />
                </button>
                
                <button onClick={handlePrev} className="text-white/60 hover:text-white transition-colors active:scale-90">
                  <SkipBack size={18} fill="currentColor" />
                </button>
                
                <button 
                  onClick={handlePlayPause} 
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95 shadow-md"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                
                <button onClick={handleNext} className="text-white/60 hover:text-white transition-colors active:scale-90">
                  <SkipForward size={18} fill="currentColor" />
                </button>
                  {/* Dummy placeholder spacer agar seimbang dengan posisi tombol repeat */}
                <div className="w-4 h-4 invisible" />
              </div>
            </div>
          ) : (
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

          <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-1.5">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] text-white/30 font-mono px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:scale-105 shadow-lg"
        >
          {isPlaying && (
            <span className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-40" />
          )}
          <div className={isPlaying ? 'animate-spin-slow' : 'opacity-60'}>
            <Disc size={24} className="text-white" />
          </div>
        </button>
      )}

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default MusicPlayer;