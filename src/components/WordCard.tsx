import React from 'react';
import { Volume2, Mic, CheckCircle2, SkipForward, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { speakWord, playPopSound } from '../utils/audio';

interface WordCardProps {
  word: string;
  emoji?: string;
  hint?: string;
  hasUsedHint: boolean;
  onUseHint: () => void;
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  errorNotice: string | null;
  onManualSuccess: () => void;
  onSkip: () => void;
  isExploding: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  emoji,
  hint,
  hasUsedHint,
  onUseHint,
  isListening,
  isSupported,
  transcript,
  errorNotice,
  onManualSuccess,
  onSkip,
  isExploding,
}) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    onUseHint();
    speakWord(word);
  };

  const handleSuccessClick = () => {
    playPopSound();
    onManualSuccess();
  };

  const handleSkipClick = () => {
    playPopSound();
    onSkip();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center">
      {/* Main Flashcard */}
      <div
        className={`relative w-full bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(245,158,11,0.22)] border-4 border-amber-300 flex flex-col items-center justify-center transition-all duration-300 ${
          isExploding ? 'opacity-0 scale-90' : 'animate-pop-in'
        }`}
      >
        {/* Floating sparkle icons in corner */}
        <div className="absolute top-4 left-5 flex items-center gap-1 text-amber-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        {/* Listen Button in Top Right */}
        <button
          onClick={handleSpeak}
          title="Hear this word (counts as hint)"
          className={`absolute top-4 right-4 p-3 rounded-2xl border-2 shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
            hasUsedHint
              ? 'bg-amber-200 text-amber-900 border-amber-400'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300'
          }`}
        >
          <Volume2 className="w-6 h-6" />
          <span className="text-xs md:text-sm font-bold pr-1">Hear Word</span>
        </button>

        {/* Optional Emoji / Mascot */}
        {emoji && (
          <div className="text-5xl md:text-6xl mb-3 animate-float select-none">
            {emoji}
          </div>
        )}

        {/* The Word */}
        <div className="my-2 py-2 select-none">
          <span className="text-6xl md:text-8xl font-black tracking-widest text-amber-950 font-['Fredoka'] drop-shadow-sm">
            {word}
          </span>
        </div>

        {/* Hint text if available */}
        {hint && (
          <p className="text-amber-800/70 text-sm md:text-base font-semibold mt-1 mb-2 text-center">
            {hint}
          </p>
        )}

        {/* Hint status indicator */}
        {hasUsedHint && (
          <div className="mb-3 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 animate-pop-in">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Hint used — practice mode (no sticker this round)</span>
          </div>
        )}

        {/* Speech Recognition Status Badge */}
        <div className="mt-2 flex flex-col items-center">
          {isSupported ? (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-xs md:text-sm font-bold transition-all duration-300 ${
                isListening
                  ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm animate-pulse'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Mic className={`w-4 h-4 ${isListening ? 'text-rose-600' : 'text-amber-600'}`} />
                {isListening && (
                  <span className="absolute -inset-1 rounded-full bg-rose-400 opacity-40 animate-ping" />
                )}
              </div>
              <span>{isListening ? 'Listening for your voice...' : 'Microphone ready'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Voice recognition not supported in this browser. Use HTTPS or Chrome.</span>
            </div>
          )}

          {/* Transcript feedback bubble */}
          {transcript && (
            <div className="mt-3 px-4 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs md:text-sm font-medium shadow-xs max-w-sm text-center animate-fade-in">
              👂 Heard: <span className="font-bold text-amber-950">"{transcript}"</span>
            </div>
          )}

          {errorNotice && (
            <p className="text-xs text-rose-600 font-semibold mt-2 text-center max-w-xs">
              {errorNotice}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons: Parent / Child override & Skip */}
      <div className="w-full mt-6 flex items-center justify-center gap-4">
        {/* "I Said It!" Button (Pass/Practice - does not collect word) */}
        <button
          onClick={handleSuccessClick}
          className="flex-1 max-w-xs py-3.5 px-5 rounded-2xl bg-gradient-to-b from-teal-400 to-teal-600 text-white font-black text-base md:text-lg shadow-[0_6px_0_#115e59] hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#115e59] transition-all flex flex-col items-center justify-center cursor-pointer border-2 border-teal-300/40"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>I Said It! 👍</span>
          </div>
          <span className="text-[10px] opacity-85 font-semibold">Pass / Practice (No Sticker)</span>
        </button>

        {/* Skip button */}
        <button
          onClick={handleSkipClick}
          className="py-3.5 px-5 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-base shadow-[0_5px_0_#b45309] hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#b45309] transition-all flex items-center gap-2 cursor-pointer border-2 border-amber-300"
          title="Skip to next word"
        >
          <SkipForward className="w-5 h-5" />
          <span className="hidden sm:inline">Skip</span>
        </button>
      </div>
    </div>
  );
};
