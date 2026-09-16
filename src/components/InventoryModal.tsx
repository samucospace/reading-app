import React from 'react';
import { X, Trophy, Volume2, Sparkles, Trash2, Award } from 'lucide-react';
import { speakWord, playPopSound } from '../utils/audio';
import confetti from 'canvas-confetti';

export interface MasteredWord {
  text: string;
  emoji?: string;
  masteredAt: number;
  count: number;
}

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: MasteredWord[];
  onClearInventory: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onClearInventory,
}) => {
  if (!isOpen) return null;

  const handleWordClick = (word: MasteredWord) => {
    playPopSound();
    speakWord(word.text);

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.5, x: 0.5 },
      colors: ['#FFD166', '#06D6A0', '#118AB2', '#FF5964'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-amber-50 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-6 flex items-center justify-between border-b-4 border-amber-500/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/30 rounded-2xl backdrop-blur-xs shadow-inner">
              <Trophy className="w-8 h-8 text-amber-950 animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-amber-950 tracking-wide">
                My Word Chest 🏆
              </h2>
              <p className="text-amber-900/80 text-sm font-semibold">
                Tap any word to hear it speak and celebrate!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="p-2.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 transition-transform active:scale-90 cursor-pointer border-2 border-amber-400 shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="bg-amber-100/90 px-6 py-3 border-b-2 border-amber-200 flex items-center justify-between text-sm md:text-base font-bold text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>
              Total Words Mastered: <span className="font-black text-amber-950 text-lg">{inventory.length}</span>
            </span>
          </div>

          {inventory.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Reset your word collection for a fresh game?')) {
                  onClearInventory();
                }
              }}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Collection</span>
            </button>
          )}
        </div>

        {/* Word Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {inventory.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-amber-800/70">
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-xl font-bold text-amber-950">Your chest is ready!</p>
              <p className="text-sm max-w-sm mt-1">
                Read words out loud before the timer finishes to pop them into your treasure chest!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {inventory.map((item) => (
                <button
                  key={item.text}
                  onClick={() => handleWordClick(item)}
                  className="group relative bg-white hover:bg-amber-50 rounded-2xl p-4 border-3 border-amber-300 shadow-[0_4px_0_#fcd34d] hover:shadow-[0_2px_0_#fcd34d] hover:translate-y-0.5 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  {/* Badge count if mastered multiple times */}
                  {item.count > 1 && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-xs">
                      ×{item.count}
                    </span>
                  )}

                  {item.emoji ? (
                    <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                  ) : (
                    <Award className="w-7 h-7 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                  )}

                  <span className="text-xl md:text-2xl font-black text-amber-950 font-['Fredoka'] tracking-wider">
                    {item.text}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 opacity-80 group-hover:opacity-100">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-100/60 border-t-2 border-amber-200 flex justify-center">
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="py-3 px-8 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-lg shadow-[0_4px_0_#d97706] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            Back to Reading! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
