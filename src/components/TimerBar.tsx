import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { playTickSound } from '../utils/audio';

interface TimerBarProps {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  onTick?: (remaining: number) => void;
  onTimeout: () => void;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  totalSeconds,
  remainingSeconds,
  isRunning,
  onTimeout,
}) => {
  const percent = totalSeconds > 0 ? Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100)) : 100;

  // Gentle sound cue when last 3 seconds are ticking
  useEffect(() => {
    if (isRunning && remainingSeconds > 0 && remainingSeconds <= 3) {
      // Play a soft tick tone
      playTickSound(450 + (3 - remainingSeconds) * 100);
    }
  }, [remainingSeconds, isRunning]);

  // Determine vibrant color theme based on urgency
  let barGradient = 'from-emerald-400 via-teal-400 to-cyan-500';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let glowColor = 'shadow-emerald-200';

  if (percent < 35) {
    barGradient = 'from-rose-500 via-pink-500 to-red-500 animate-pulse';
    badgeColor = 'bg-rose-100 text-rose-700 border-rose-300 animate-wiggle';
    glowColor = 'shadow-rose-300';
  } else if (percent < 65) {
    barGradient = 'from-amber-400 via-yellow-400 to-orange-400';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    glowColor = 'shadow-amber-200';
  }

  // Handle timeout event
  useEffect(() => {
    if (remainingSeconds <= 0 && isRunning) {
      onTimeout();
    }
  }, [remainingSeconds, isRunning, onTimeout]);

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600 animate-spin-slow" />
          <span className="text-sm md:text-base font-bold text-amber-900/80 tracking-wide uppercase">
            Time to Read
          </span>
        </div>
        <div
          className={`px-3 py-1 rounded-full border-2 text-sm md:text-base font-black tracking-wide shadow-sm transition-all duration-300 ${badgeColor}`}
        >
          {totalSeconds === 0 ? 'Free Play ∞' : `${Math.ceil(remainingSeconds)}s`}
        </div>
      </div>

      {/* Progress track */}
      <div className={`relative h-6 md:h-7 w-full bg-amber-200/60 rounded-full p-1 shadow-inner border-2 border-amber-300/80 overflow-hidden ${glowColor}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-200 ease-linear shadow-md relative overflow-hidden`}
          style={{ width: `${percent}%` }}
        >
          {/* Subtle shine highlight */}
          <div className="absolute inset-0 bg-white/25 -skew-x-12 translate-x-1" />
        </div>
      </div>
    </div>
  );
};
