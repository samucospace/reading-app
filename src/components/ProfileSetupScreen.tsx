import React, { useState } from 'react';
import { UserPlus, Sparkles, Trophy, Trash2, Check, ArrowRight } from 'lucide-react';
import type { UserProfile } from '../types/profile';
import { playPopSound, playSuccessExplosionSound } from '../utils/audio';

const AVATARS = [
  '🦁', '🚀', '🦄', '🦖', '🐱', '🐶',
  '🐼', '🦊', '🐯', '🐸', '👑', '⭐',
  '🐬', '🦸', '🦉', '🌈',
];

interface ProfileSetupScreenProps {
  profiles: UserProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string, avatar: string) => void;
  onDeleteProfile: (id: string) => void;
  onStartGame: () => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onStartGame,
}) => {
  const [isCreating, setIsCreating] = useState(profiles.length === 0);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    playSuccessExplosionSound();
    onCreateProfile(cleanName, selectedAvatar);
    setName('');
    setIsCreating(false);
  };

  const handleStart = () => {
    if (!selectedProfileId) return;
    playPopSound();
    onStartGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-100 flex flex-col items-center justify-center p-4 select-none font-['Fredoka'] text-amber-950">
      <div className="w-full max-w-2xl bg-white/85 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-[0_20px_60px_rgba(245,158,11,0.25)] border-4 border-amber-300 flex flex-col items-center animate-pop-in">
        {/* App Logo & Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-600 shadow-md flex items-center justify-center text-2xl animate-float">
            ⭐
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-wider text-amber-950">
            Word<span className="text-orange-600">Pop!</span>
          </h1>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-amber-900 mb-1 text-center">
          Who is Reading Today? 📚✨
        </h2>
        <p className="text-amber-800/70 text-xs md:text-sm font-semibold mb-6 text-center">
          Pick your profile to collect words in your personal treasure chest!
        </p>

        {/* Existing Profiles List */}
        {profiles.length > 0 && (
          <div className="w-full mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {profiles.map((p) => {
                const isSelected = selectedProfileId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      playPopSound();
                      onSelectProfile(p.id);
                    }}
                    className={`relative rounded-2xl p-4 border-3 cursor-pointer transition-all flex flex-col items-center justify-center group ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 shadow-[0_6px_0_#d97706] -translate-y-1'
                        : 'bg-white hover:bg-amber-50/80 border-amber-200 shadow-sm'
                    }`}
                  >
                    {/* Selected check badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}

                    {/* Delete profile option */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete profile for ${p.name}? All collected words will be removed.`)) {
                          onDeleteProfile(p.id);
                        }
                      }}
                      title="Delete profile"
                      className="absolute top-2 left-2 p-1.5 rounded-lg text-amber-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="text-4xl md:text-5xl mb-1.5 transition-transform group-hover:scale-110">
                      {p.avatar}
                    </div>

                    <span className="font-black text-lg text-amber-950 truncate max-w-[120px]">
                      {p.name}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-0.5">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      <span>{p.inventory.length} words</span>
                    </div>
                  </div>
                );
              })}

              {/* Add New Profile Tile */}
              {!isCreating && (
                <button
                  onClick={() => {
                    playPopSound();
                    setIsCreating(true);
                  }}
                  className="rounded-2xl p-4 border-3 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-amber-800 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[120px]"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-1 text-amber-700">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs md:text-sm">New Reader</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Create Profile Form Card */}
        {isCreating && (
          <div className="w-full bg-amber-100/70 rounded-2xl p-5 border-2 border-amber-300 mb-6 animate-pop-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Create New Reader Profile</span>
              </h3>
              {profiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Reader's Name:
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={18}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leo, Maya, Oliver..."
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 bg-white focus:border-amber-500 focus:outline-none font-bold text-amber-950 text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1.5">
                  Pick an Icon / Avatar:
                </label>
                <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setSelectedAvatar(av);
                      }}
                      className={`text-2xl p-1.5 rounded-xl border-2 transition-transform cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-amber-300 border-amber-500 scale-110 shadow-xs'
                          : 'bg-white hover:bg-amber-50 border-amber-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-b from-amber-400 to-orange-400 text-amber-950 font-black text-base shadow-[0_4px_0_#d97706] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
              >
                Save Profile & Choose Icon ✨
              </button>
            </form>
          </div>
        )}

        {/* Start Button */}
        {selectedProfile && !isCreating && (
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 text-white font-black text-xl shadow-[0_8px_0_#065f46] hover:brightness-105 active:translate-y-1.5 active:shadow-[0_2px_0_#065f46] transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-300/40"
          >
            <span>Start Reading as {selectedProfile.name}!</span>
            <span className="text-2xl">{selectedProfile.avatar}</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
