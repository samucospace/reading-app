import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, Trophy, Settings, Flame, RotateCcw, Users, Shuffle } from 'lucide-react';
import { DEFAULT_WORD_CATEGORIES } from './data/wordLists';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { WordCard } from './components/WordCard';
import { TimerBar } from './components/TimerBar';
import { WordExplosion } from './components/WordExplosion';
import { InventoryModal } from './components/InventoryModal';
import { SettingsModal } from './components/SettingsModal';
import { ProfileSetupScreen } from './components/ProfileSetupScreen';
import type { UserProfile } from './types/profile';
import {
  playPopSound,
  playSuccessExplosionSound,
  playTimeoutSound,
} from './utils/audio';

interface WordItem {
  text: string;
  hint?: string;
  emoji?: string;
}

const STORAGE_KEY_PROFILES = 'wordpop_profiles_v2';
const STORAGE_KEY_ACTIVE_PROFILE_ID = 'wordpop_active_profile_id_v2';
const STORAGE_KEY_CUSTOM_WORDS = 'wordpop_custom_words_v2';

export const App: React.FC = () => {
  // Profiles state
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE_ID) || null;
    } catch {
      return null;
    }
  });

  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
      const list = saved ? JSON.parse(saved) : [];
      const active = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE_ID);
      return !active || list.length === 0 || !list.some((p: UserProfile) => p.id === active);
    } catch {
      return true;
    }
  });

  // Custom words state
  const [customWords, setCustomWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_WORDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Settings state
  const [activeCategoryId, setActiveCategoryId] = useState<string>('cvc');
  const [timerDuration, setTimerDuration] = useState<number>(10);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [forgivingMode, setForgivingMode] = useState<boolean>(true);

  // Active word and progression state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(10);
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [explodingWord, setExplodingWord] = useState<string>('');
  const [streak, setStreak] = useState<number>(0);
  const [timeoutNotice, setTimeoutNotice] = useState<string | null>(null);
  const [hasUsedHint, setHasUsedHint] = useState<boolean>(false);

  // Modals
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Active profile object
  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || null;
  }, [profiles, activeProfileId]);

  // Save profiles
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch {
      // ignore
    }
  }, [profiles]);

  // Save active profile ID
  useEffect(() => {
    try {
      if (activeProfileId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE_ID, activeProfileId);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_PROFILE_ID);
      }
    } catch {
      // ignore
    }
  }, [activeProfileId]);

  // Save custom words
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_WORDS, JSON.stringify(customWords));
    } catch {
      // ignore
    }
  }, [customWords]);

  // Create new profile
  const handleCreateProfile = (name: string, avatar: string) => {
    const newProfile: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      avatar,
      inventory: [],
      createdAt: Date.now(),
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  // Delete profile
  const handleDeleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
      setIsSetupOpen(true);
    }
  };

  // Deck shuffling state
  const [shuffleSeed, setShuffleSeed] = useState<number>(1);

  // Build active word deck
  const activeDeck: WordItem[] = useMemo(() => {
    let base: WordItem[];
    if (activeCategoryId === 'all') {
      const combined = DEFAULT_WORD_CATEGORIES.flatMap((c) => c.words);
      const customs: WordItem[] = customWords.map((cw) => ({
        text: cw,
        hint: 'Custom Word',
        emoji: '⭐',
      }));
      base = [...combined, ...customs];
    } else {
      const cat = DEFAULT_WORD_CATEGORIES.find((c) => c.id === activeCategoryId);
      base = cat ? cat.words : DEFAULT_WORD_CATEGORIES[0].words;
    }

    if (shuffleSeed > 0) {
      const shuffled = [...base];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    return base;
  }, [activeCategoryId, customWords, shuffleSeed]);

  // Current active word item
  const currentWordItem: WordItem = useMemo(() => {
    if (activeDeck.length === 0) {
      return { text: 'CAT', hint: 'Meow! A furry pet', emoji: '🐱' };
    }
    return activeDeck[currentIndex % activeDeck.length];
  }, [activeDeck, currentIndex]);

  // Reset hint state whenever index changes
  useEffect(() => {
    setHasUsedHint(false);
  }, [currentIndex]);

  // Timer countdown hook
  useEffect(() => {
    if (isSetupOpen || timerDuration === 0 || isExploding || isInventoryOpen || isSettingsOpen) {
      return;
    }

    const interval = 100;
    const timerId = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - interval / 1000;
        return next <= 0 ? 0 : next;
      });
    }, interval);

    return () => clearInterval(timerId);
  }, [isSetupOpen, timerDuration, isExploding, isInventoryOpen, isSettingsOpen, currentIndex]);

  // Success handler: can be voice success or manual override
  const handleWordSuccess = useCallback(
    (matchedWord: string, isVoiceSuccess: boolean) => {
      if (isExploding) return;

      const canCollect = isVoiceSuccess && !hasUsedHint;

      if (soundEnabled) {
        playSuccessExplosionSound();
      }

      setExplodingWord(matchedWord);
      setIsExploding(true);

      if (canCollect && activeProfileId) {
        setStreak((prev) => prev + 1);
        setTimeoutNotice(null);

        // Add to active profile's inventory
        setProfiles((prevProfiles) => {
          return prevProfiles.map((p) => {
            if (p.id !== activeProfileId) return p;

            const existingIdx = p.inventory.findIndex(
              (item) => item.text.toUpperCase() === matchedWord.toUpperCase()
            );

            let updatedInventory;
            if (existingIdx >= 0) {
              updatedInventory = [...p.inventory];
              updatedInventory[existingIdx] = {
                ...updatedInventory[existingIdx],
                count: updatedInventory[existingIdx].count + 1,
                masteredAt: Date.now(),
              };
            } else {
              updatedInventory = [
                {
                  text: matchedWord.toUpperCase(),
                  emoji: currentWordItem.emoji,
                  masteredAt: Date.now(),
                  count: 1,
                },
                ...p.inventory,
              ];
            }

            return {
              ...p,
              inventory: updatedInventory,
            };
          });
        });
      } else {
        // Did not earn sticker because hint was used or tapped "I said it"
        setTimeoutNotice(
          hasUsedHint
            ? 'Great practice with the hint! Read without hints to collect the sticker! 🌟'
            : 'Good practice! Read out loud with your voice to collect the sticker! 🎤'
        );
      }
    },
    [isExploding, soundEnabled, currentWordItem, hasUsedHint, activeProfileId]
  );

  // When explosion animation finishes, load next word
  const handleExplosionComplete = useCallback(() => {
    setIsExploding(false);
    setHasUsedHint(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
    setRemainingSeconds(timerDuration > 0 ? timerDuration : 0);
  }, [activeDeck.length, timerDuration]);

  // Timeout handler: 10 seconds expired
  const handleTimeout = useCallback(() => {
    if (isExploding || timerDuration === 0) return;

    if (soundEnabled) {
      playTimeoutSound();
    }

    setTimeoutNotice(`Time's up! Let's try another one! 🌟`);
    setStreak(0);

    setTimeout(() => {
      setTimeoutNotice(null);
      setHasUsedHint(false);
      setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
      setRemainingSeconds(timerDuration);
    }, 1200);
  }, [isExploding, timerDuration, soundEnabled, activeDeck.length]);

  // Skip to next word
  const handleSkipWord = useCallback(() => {
    playPopSound();
    setTimeoutNotice(null);
    setHasUsedHint(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
    setRemainingSeconds(timerDuration > 0 ? timerDuration : 0);
  }, [activeDeck.length, timerDuration]);

  // Reset current word timer
  const handleResetTimer = useCallback(() => {
    playPopSound();
    setRemainingSeconds(timerDuration);
    setTimeoutNotice(null);
  }, [timerDuration]);

  // Clear active profile's inventory
  const handleClearInventory = () => {
    if (!activeProfileId) return;
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, inventory: [] } : p))
    );
  };

  // Add custom words
  const handleAddCustomWords = (newWords: string[]) => {
    setCustomWords((prev) => Array.from(new Set([...prev, ...newWords])));
  };

  // Speech recognition hook
  const { isListening, transcript, isSupported, errorNotice } = useSpeechRecognition({
    targetWord: currentWordItem.text,
    onSuccess: (word) => handleWordSuccess(word, true),
    enabled: !isSetupOpen && !isExploding && !isInventoryOpen && !isSettingsOpen,
    forgivingMode,
  });

  // If on setup screen or no profile chosen, render ProfileSetupScreen
  if (isSetupOpen || !activeProfile) {
    return (
      <ProfileSetupScreen
        profiles={profiles}
        selectedProfileId={activeProfileId}
        onSelectProfile={(id) => setActiveProfileId(id)}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
        onStartGame={() => {
          setIsSetupOpen(false);
          setRemainingSeconds(timerDuration > 0 ? timerDuration : 0);
        }}
      />
    );
  }

  const currentInventory = activeProfile.inventory || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-100 flex flex-col justify-between select-none font-['Fredoka'] text-amber-950">
      {/* Top Header Bar */}
      <header className="w-full px-4 py-4 max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo & Active Profile Switcher */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-600 shadow-md flex items-center justify-center text-xl md:text-2xl animate-float">
            ⭐
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider text-amber-950">
              Word<span className="text-orange-600">Pop!</span>
            </h1>

            {/* Profile pill with switch option */}
            <button
              onClick={() => {
                playPopSound();
                setIsSetupOpen(true);
              }}
              title="Switch Reader Profile"
              className="flex items-center gap-1.5 py-0.5 px-2 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-black border border-amber-400 transition-colors cursor-pointer mt-0.5 shadow-2xs"
            >
              <span className="text-sm">{activeProfile.avatar}</span>
              <span>{activeProfile.name}</span>
              <Users className="w-3 h-3 text-amber-700 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Streak Counter */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-orange-100 text-orange-800 border-2 border-orange-300 font-black text-xs md:text-sm shadow-xs animate-pop-in">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{streak} Streak!</span>
            </div>
          )}

          {/* Treasure Chest / Inventory Button */}
          <button
            onClick={() => {
              playPopSound();
              setIsInventoryOpen(true);
            }}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs md:text-sm border-2 border-amber-400 shadow-[0_3px_0_#d97706] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Open Word Chest"
          >
            <Trophy className="w-4 h-4 text-amber-800" />
            <span>Chest ({currentInventory.length})</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              playPopSound();
              setIsSettingsOpen(true);
            }}
            className="p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 shadow-sm active:scale-95 transition-transform cursor-pointer"
            title="Settings & Word Decks"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 flex flex-col justify-center items-center">
        {/* Notice Banner */}
        {timeoutNotice && (
          <div className="mb-4 px-6 py-2.5 rounded-2xl bg-amber-300/90 border-2 border-amber-500 text-amber-950 font-black text-sm md:text-base shadow-md animate-pop-in flex items-center gap-2 text-center">
            <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
            <span>{timeoutNotice}</span>
          </div>
        )}

        {/* 10-Second Countdown Timer Bar */}
        <div className="w-full mb-6">
          <TimerBar
            totalSeconds={timerDuration}
            remainingSeconds={remainingSeconds}
            isRunning={!isExploding && !isInventoryOpen && !isSettingsOpen}
            onTimeout={handleTimeout}
          />
        </div>

        {/* Flashcard with Word & Voice Recognition */}
        <WordCard
          word={currentWordItem.text}
          emoji={currentWordItem.emoji}
          hint={currentWordItem.hint}
          hasUsedHint={hasUsedHint}
          onUseHint={() => setHasUsedHint(true)}
          isListening={isListening}
          isSupported={isSupported}
          transcript={transcript}
          errorNotice={errorNotice}
          onManualSuccess={() => handleWordSuccess(currentWordItem.text, false)}
          onSkip={handleSkipWord}
          isExploding={isExploding}
        />

        {/* Action helper buttons */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => {
              playPopSound();
              setShuffleSeed((prev) => prev + 1);
              setCurrentIndex(0);
              setRemainingSeconds(timerDuration > 0 ? timerDuration : 0);
            }}
            className="flex items-center gap-1.5 text-xs text-amber-800/80 hover:text-amber-950 font-bold cursor-pointer py-1.5 px-3.5 rounded-xl bg-amber-200/50 hover:bg-amber-200 border border-amber-300 transition-colors shadow-2xs"
            title="Shuffle deck order"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Deck 🔀</span>
          </button>

          <button
            onClick={handleResetTimer}
            className="flex items-center gap-1.5 text-xs text-amber-800/80 hover:text-amber-950 font-bold cursor-pointer py-1.5 px-3.5 rounded-xl bg-amber-200/50 hover:bg-amber-200 border border-amber-300 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart 10s Timer</span>
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full py-4 text-center text-xs text-amber-800/60 font-medium">
        Reader: <span className="font-bold">{activeProfile.name} {activeProfile.avatar}</span> • Speak clearly into your device’s microphone 🌟
      </footer>

      {/* Full-screen explosion canvas animation when child succeeds */}
      {isExploding && (
        <WordExplosion
          word={explodingWord}
          onComplete={handleExplosionComplete}
        />
      )}

      {/* Inventory / Sticker Chest Modal */}
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventory={currentInventory}
        onClearInventory={handleClearInventory}
      />

      {/* Settings & Word Decks Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        categories={DEFAULT_WORD_CATEGORIES}
        activeCategoryId={activeCategoryId}
        onSelectCategory={(id) => {
          setActiveCategoryId(id);
          setCurrentIndex(0);
          setHasUsedHint(false);
          setRemainingSeconds(timerDuration > 0 ? timerDuration : 0);
        }}
        timerDuration={timerDuration}
        onSelectTimerDuration={(sec) => {
          setTimerDuration(sec);
          setRemainingSeconds(sec > 0 ? sec : 0);
        }}
        customWords={customWords}
        onAddCustomWords={handleAddCustomWords}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        forgivingMode={forgivingMode}
        onToggleForgivingMode={() => setForgivingMode((prev) => !prev)}
      />
    </div>
  );
};

export default App;
