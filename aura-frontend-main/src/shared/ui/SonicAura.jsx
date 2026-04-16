import { useState, useEffect, useRef } from 'react';
import { Music2, VolumeX, Volume2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

/**
 * SonicAura - Generates procedurally synthesized ambient soundscapes 
 * based on the user's current Sigil (Aura Color and Complexity).
 * Redesigned with Tailwind CSS and Lucide icons.
 */
export function SonicAura({ auraColor = '#14B8A6', complexity = 5, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtx = useRef(null);
  const oscillators = useRef([]);
  const gainNode = useRef(null);

  const togglePlayback = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
    setIsPlaying(!isPlaying);
  };

  const startSound = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }

    gainNode.current = audioCtx.current.createGain();
    gainNode.current.gain.setValueAtTime(0, audioCtx.current.currentTime);
    gainNode.current.gain.linearRampToValueAtTime(0.1, audioCtx.current.currentTime + 2);
    gainNode.current.connect(audioCtx.current.destination);

    // Generate base frequency from color (Hue)
    const hue = hexToHue(auraColor);
    const baseFreq = 100 + (hue / 360) * 200; // 100Hz to 300Hz

    // Create a series of oscillators based on complexity
    const count = Math.min(8, complexity);
    for (let i = 0; i < count; i++) {
      const osc = audioCtx.current.createOscillator();
      const lfo = audioCtx.current.createOscillator();
      const lfoGain = audioCtx.current.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * (1 + i * 0.5), audioCtx.current.currentTime);
      
      lfo.frequency.setValueAtTime(0.1 + (i * 0.05), audioCtx.current.currentTime);
      lfoGain.gain.setValueAtTime(10, audioCtx.current.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gainNode.current);

      osc.start();
      lfo.start();
      oscillators.current.push({ osc, lfo });
    }
  };

  const stopSound = () => {
    if (gainNode.current && audioCtx.current) {
      gainNode.current.gain.linearRampToValueAtTime(0, audioCtx.current.currentTime + 1);
      setTimeout(() => {
        oscillators.current.forEach(({ osc, lfo }) => {
          try {
            osc.stop();
            lfo.stop();
          } catch (e) {
            // Oscillator might already be stopped
          }
        });
        oscillators.current = [];
      }, 1000);
    }
  };

  function hexToHue(hex) {
    if (!hex.startsWith('#')) return 180; // Default to teal hue
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return h * 360;
  }

  useEffect(() => {
    return () => stopSound();
  }, []);

  return (
    <button
      onClick={togglePlayback}
      title={isPlaying ? "Silence the Sanctuary" : "Activate Sonic Aura"}
      className={cn(
        "relative p-2.5 rounded-xl transition-all duration-300 border flex items-center justify-center",
        isPlaying 
          ? "bg-teal-500/10 border-teal-500/50 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)]" 
          : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-500",
        className
      )}
    >
      <div className="relative">
        {isPlaying ? (
          <>
            <Volume2 size={20} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
          </>
        ) : (
          <VolumeX size={20} />
        )}
      </div>
      
      {isPlaying && (
        <div className="ml-2 flex items-end gap-0.5 h-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="w-0.5 bg-teal-500 rounded-full animate-wave"
              style={{ 
                height: `${20 + Math.random() * 80}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
}
