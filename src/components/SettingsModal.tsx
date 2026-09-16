import React, { useState } from 'react';
import { X, Settings, Plus, Sparkles, Sliders, Volume2, VolumeX, Mic } from 'lucide-react';
import type { WordCategory } from '../data/wordLists';
import { playPopSound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: WordCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  timerDuration: number;
  onSelectTimerDuration: (seconds: number) => void;
  customWords: string[];
  onAddCustomWords: (words: string[]) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  forgivingMode: boolean;
  onToggleForgivingMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  categories,
  activeCategoryId,
  onSelectCategory,
  timerDuration,
  onSelectTimerDuration,
  customWords,
  onAddCustomWords,
  soundEnabled,
  onToggleSound,
  forgivingMode,
  onToggleForgivingMode,
}) => {
  const [newWordsInput, setNewWordsInput] = useState('');

  if (!isOpen) return null;

  const handleAddWords = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordsInput.trim()) return;

    const parsed = newWordsInput
      .split(/[\n,]+/)
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length > 0 && /^[A-Z\s'-]+$/.test(w));

    if (parsed.length > 0) {
      onAddCustomWords(parsed);
      setNewWordsInput('');
      playPopSound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-amber-50 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-6 flex items-center justify-between border-b-4 border-amber-500/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/30 rounded-2xl backdrop-blur-xs">
              <Settings className="w-7 h-7 text-amber-950" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-amber-950">Settings & Word Packs</h2>
              <p className="text-amber-900/80 text-xs md:text-sm font-semibold">
                Customize time, word decks, and sensitivity
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Timer Selection */}
          <div>
            <label className="flex items-center gap-2 text-base font-black text-amber-950 mb-3">
              <Sliders className="w-5 h-5 text-amber-600" />
              <span>Flashcard Timer Duration</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '5s ⚡', value: 5 },
                { label: '10s 🎯', value: 10 },
                { label: '15s 🐢', value: 15 },
                { label: 'No Limit ♾️', value: 0 },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    playPopSound();
                    onSelectTimerDuration(option.value);
                  }}
                  className={`py-2.5 px-2 rounded-2xl font-black text-xs md:text-sm border-2 transition-all cursor-pointer ${
                    timerDuration === option.value
                      ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-[0_3px_0_#b45309]'
                      : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Sensitivity Setting */}
          <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border-2 border-amber-200">
            <div className="flex items-center gap-3">
              <Mic className="w-6 h-6 text-indigo-600" />
              <div>
                <span className="font-bold text-amber-950 text-sm md:text-base">Kid-Friendly Voice Match</span>
                <p className="text-xs text-amber-800/70">
                  {forgivingMode
                    ? 'Forgiving (tolerates accents, sounding out & near matches)'
                    : 'Strict (exact dictionary match only)'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playPopSound();
                onToggleForgivingMode();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm cursor-pointer border transition-all ${
                forgivingMode
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              {forgivingMode ? 'Forgiving ✨' : 'Strict 🎯'}
            </button>
          </div>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border-2 border-amber-200">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <VolumeX className="w-6 h-6 text-rose-500" />
              )}
              <div>
                <span className="font-bold text-amber-950 text-sm md:text-base">Sound Effects</span>
                <p className="text-xs text-amber-800/70">Celebration fanfares & button pops</p>
              </div>
            </div>

            <button
              onClick={() => {
                playPopSound();
                onToggleSound();
              }}
              className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm cursor-pointer border transition-all ${
                soundEnabled
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Choose Word Deck */}
          <div>
            <label className="flex items-center gap-2 text-base font-black text-amber-950 mb-3">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Choose Word Deck</span>
            </label>
            <div className="space-y-2.5">
              {categories.map((cat) => {
                const isActive = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playPopSound();
                      onSelectCategory(cat.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-500 shadow-sm'
                        : 'bg-white border-amber-200 hover:bg-amber-50 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.emoji}</span>
                      <div>
                        <div className="font-black text-amber-950 text-base flex items-center gap-2">
                          {cat.name}
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-amber-800/80 font-medium">{cat.description}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                      {cat.words.length} words
                    </span>
                  </button>
                );
              })}

              {/* All Mixed Deck */}
              <button
                onClick={() => {
                  playPopSound();
                  onSelectCategory('all');
                }}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  activeCategoryId === 'all'
                    ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-500 shadow-sm'
                    : 'bg-white border-amber-200 hover:bg-amber-50 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌈</span>
                  <div>
                    <div className="font-black text-amber-950 text-base flex items-center gap-2">
                      All Packs Mixed!
                      {activeCategoryId === 'all' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-amber-800/80 font-medium">
                      Shuffle words from every category
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Words Section */}
          <div className="p-4 bg-white rounded-2xl border-2 border-amber-200 space-y-3">
            <h3 className="font-black text-amber-950 text-sm md:text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>Add Custom Words</span>
            </h3>
            <p className="text-xs text-amber-800/80">
              Enter custom words (e.g. family names, sight words from school):
            </p>
            <form onSubmit={handleAddWords} className="flex gap-2">
              <input
                type="text"
                value={newWordsInput}
                onChange={(e) => setNewWordsInput(e.target.value)}
                placeholder="MOM, DAD, PIZZA, ROBOT..."
                className="flex-1 px-3 py-2 rounded-xl border-2 border-amber-200 focus:border-amber-500 outline-none text-sm uppercase font-bold text-amber-950"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs md:text-sm cursor-pointer shadow-sm transition-all"
              >
                Add
              </button>
            </form>
            {customWords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {customWords.map((cw) => (
                  <span
                    key={cw}
                    className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300"
                  >
                    {cw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-100/60 border-t-2 border-amber-200 flex justify-center">
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="py-3 px-8 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-base shadow-[0_4px_0_#d97706] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            Save & Continue 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
