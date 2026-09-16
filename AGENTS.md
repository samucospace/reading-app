# AGENTS.md — Agent & Developer Handbook for WordPop!

This document provides architectural context, design principles, and technical guidelines for AI agents and human developers maintaining or extending **WordPop!**.

---

## 🎯 Purpose & Design Philosophy

WordPop! is an offline-capable, lightweight, voice-interactive educational web app for early readers (ages 4–8).

### Guiding Principles:
1. **Zero External Assets**: No external `.mp3` or video files. Sound effects are synthesized live using the **Web Audio API**; speech is synthesized using the browser's native **SpeechSynthesis API**. This ensures instant loading (under 100 kB gzipped) and reliable offline operation.
2. **Kid-Centric UX**: Dyslexia-friendly, high-contrast typography (`Fredoka`, `Quicksand`), 3D tactile buttons, large touch targets, and encouraging animations.
3. **Graceful Degradation**: Young kids may mispronounce words or have high background noise. The speech recognition pipeline includes fuzzy matching, phonetic homophone tolerance, and manual parent validation.
4. **Earned vs. Practice Integrity**: Words are only added to a child's collection if read independently with their voice **without using hints**.

---

## 🏗️ Architecture & Component Breakdown

### 1. Game State & Flow (`src/App.tsx`)
- Coordinates the primary game loop:
  - Active profile selection ➔ Word display ➔ 10s countdown ➔ Speech / Override ➔ Particle Explosion ➔ Inventory storage ➔ Next word flash.
- **Key State Variables**:
  - `profiles: UserProfile[]`: Array of all reader profiles saved in `localStorage`.
  - `activeProfileId: string | null`: Current active reader ID.
  - `currentIndex: number`: Index of current flashcard.
  - `remainingSeconds: number`: Managed via a 100ms interval for smooth rendering.
  - `hasUsedHint: boolean`: Flagged when "Hear Word" is tapped. Disables sticker collection for the round.
  - `isExploding: boolean`: Pauses timer and overlays canvas explosion.

### 2. Speech Recognition Pipeline (`src/hooks/useSpeechRecognition.ts`)
- Utilizes `window.SpeechRecognition` or `window.webkitSpeechRecognition`.
- **Matching Pipeline (`checkWordMatch`)**:
  1. Cleans and extracts words: `transcript.toUpperCase().replace(/[^A-Z\s]/g, ' ').split(/\s+/)`.
  2. Exact token match: checks if target word is inside spoken words.
  3. Homophone resolution: handles phonetic matches defined in `HOMOPHONES` (e.g. `SUN` ➔ `SON`, `SEE` ➔ `SEA`, `RED` ➔ `READ`, `BEAR` ➔ `BARE`).
  4. Plural suffix tolerance: matches `CATS` for `CAT` or `DOGS` for `DOG`.
- **Reconnection Logic**: In Chromium browsers, speech recognition can time out during silence. The hook automatically restarts listening if `enabled` is true and no match has occurred yet.

### 3. Audio Synthesis Engine (`src/utils/audio.ts`)
- **`playPopSound()`**: Fast sine wave frequency sweep (320Hz ➔ 780Hz) with exponential gain decay (0.12s) for tactile button feedback.
- **`playSuccessExplosionSound()`**: Multi-oscillator major chord arpeggio (`C5`, `E5`, `G5`, `C6`, `E6`) staggered by 55ms with triangle waveforms, plus a high-frequency sparkle noise sweep (1600Hz ➔ 2600Hz).
- **`playTickSound(pitch)`**: Clean high-frequency sine tick for timer countdown urgency.
- **`speakWord(word)`**: Wraps `window.speechSynthesis` with optimized child-friendly speech rate (0.85) and pitch (1.15), picking natural voices where available.

### 4. Explosion Physics Engine (`src/components/WordExplosion.tsx`)
- Multi-layer canvas animation run via `requestAnimationFrame` for 1.8 seconds:
  - **Letter Fragments (`LetterFragment`)**: The word string is split into individual letters that fly outwards with independent velocity, rotation (`vRot`), scale, and gravity (`vy += 0.42`).
  - **Particle Shower (`Particle`)**: 120+ particles (circles, 5-point stars, squares) with velocity, air drag (`vx *= 0.98`), gravity, and alpha fade.
  - **Shockwave Ring**: Expanding golden shockwave ring (`ctx.arc`) fading exponentially.
  - **Canvas Confetti**: Side-cannon confetti bursts launched at $(x: 0.3, y: 0.6)$ and $(x: 0.7, y: 0.6)$.

### 5. Multi-Profile & Inventory Storage (`src/types/profile.ts`)
- **Storage Schema**:
  - `wordpop_profiles_v2`: Array of `UserProfile` objects:
    ```typescript
    interface UserProfile {
      id: string;
      name: string;
      avatar: string;
      inventory: MasteredWord[];
      createdAt: number;
    }
    ```
  - `wordpop_active_profile_id_v2`: ID string of the currently active profile.
  - `wordpop_custom_words_v2`: Array of user-added custom word strings.

---

## ⚠️ Critical Development Guardrails

1. **TypeScript & `verbatimModuleSyntax`**:
   - The project has `verbatimModuleSyntax` enabled in `tsconfig.json`.
   - **Always** use type-only imports for interfaces and types:
     ```typescript
     import type { UserProfile } from './types/profile';
     import type { MasteredWord } from './components/InventoryModal';
     ```
2. **Mobile Microphone HTTPS Requirement**:
   - Mobile browsers (Safari on iOS, Chrome on Android) **strictly refuse microphone access on plain HTTP** when accessed via LAN IP.
   - Vite is configured with `@vitejs/plugin-basic-ssl` to serve HTTPS by default. Do not remove this plugin without providing an alternative HTTPS proxy.
3. **Preserve Audio Synthesizer**:
   - Do not replace the Web Audio oscillators with external media assets (`.mp3`/`.wav`) unless explicitly requested by the user. The synthesis pattern keeps the application lightweight and instant.
4. **Tailwind CSS v4 Conventions**:
   - Uses `@tailwindcss/vite` with `@import "tailwindcss";` in `src/index.css`.
   - Custom animations (`animate-pop-in`, `animate-wiggle`, `animate-float`) are defined in `@layer base` or root CSS in `src/index.css`.

---

## 🛠️ Verification & Build Commands

```bash
# Type check and build bundle
npm run build

# Start dev server with HTTPS and LAN hosting
npm run dev -- --host

# Linting
npm run lint
```
