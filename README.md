# WordPop! ✨ — Voice-Powered Reading App for Kids

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Web Speech API](https://img.shields.io/badge/Web_Speech-Native_API-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A lightweight, delightful, voice-interactive web application designed to help children learn to read. Kids are presented with a flashcard and have **10 seconds** to read the word out loud. When they read it correctly, the word **explodes in a shower of particles and confetti**, plays a celebratory fanfare, and is collected into their personal **Word Chest**!

---

## 🌟 Highlights & Features

- **⏱️ 10-Second Visual Timer**: Dynamic countdown bar with smooth color transitions (Emerald ➔ Sunflower Amber ➔ Coral Red) and gentle audio ticks in the final 3 seconds. Adjustable speeds (5s, 10s, 15s, or Free Play) in Settings.
- **🎙️ Real-Time Voice Recognition**: Built on the native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`). Features fuzzy matching and phonetic homophone tolerance (e.g., SUN/SON, SEE/SEA) and handles words spoken inside sentences (*"It is a cat!"*).
- **💥 Physics Particle Explosion**: Letters physically shatter and blast outward in 3D rotation, accompanied by 120+ glowing stars, confetti particles, shockwave rings, and dual confetti cannons.
- **🎵 Zero-Dependency Web Audio Synthesizer**: Custom oscillator-based chords, celebratory fanfare arpeggios, and bubbly button pops synthesized in pure code—100% reliable offline without loading MP3 files.
- **👤 Multi-Reader Profiles**: Supports multiple children (siblings, classrooms). Each child picks an avatar (🦁, 🚀, 🦄, 🦖, etc.) and keeps their own persistent **Word Chest** saved in `localStorage`.
- **🏆 Earned vs. Practice Logic**:
  - **Earned into Chest**: Read out loud with the child's own voice with no hints.
  - **Practice Mode (No Sticker)**: Tapping **"Hear Word"** (audio hint) or **"I Said It! 👍"** (parent override) allows kids to practice and triggers the explosion, but does not award the sticker into the chest.
- **📚 Graded Word Decks & Custom Words**:
  - **Starter Phonics (CVC)**: CAT, DOG, SUN, PIG, BUG, HAT, FOX, CUP, BED...
  - **Magic Sight Words**: THE, SEE, YOU, CAN, LOOK, PLAY, LIKE, BIG, RED, BLUE...
  - **Animals & Wonders**: STAR, MOON, FROG, FISH, DUCK, TREE, LION, BEAR...
  - **Custom Words**: Parents and teachers can easily type and add custom vocabulary lists.
- **🔒 HTTPS Ready for Mobile & Tablet**: Automatically bundled with `@vitejs/plugin-basic-ssl` so you can test on iPad or Android phones over local Wi-Fi with microphone permissions enabled.

---

## 📱 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (or pnpm / yarn)

### 2. Install & Run
```bash
# Clone repository
git clone https://github.com/samucospace/reading-app.git
cd reading-app

# Install dependencies
npm install

# Start development server with HTTPS & Network access
npm run dev -- --host
```

Once running:
- **Local PC**: `https://localhost:5173/`
- **Phone / Tablet**: `https://<YOUR-LOCAL-IP>:5173/`

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📱 Testing on Mobile Browsers (Microphone Permissions)

Mobile browsers (iOS Safari, Android Chrome) strictly require a **secure origin (`https://` or `localhost`)** before granting microphone access to web apps.

### Testing on iPhone / iPad (Safari)
1. Connect your device to the same Wi-Fi network as your computer.
2. Open Safari and navigate to `https://<YOUR-COMPUTER-IP>:5173/`.
3. Safari will show *"This Connection Is Not Private"* (due to the local development SSL certificate).
4. Tap **Show Details** (or **Advanced**) ➔ Tap **"visit this website"**.
5. When prompted: *"Would you like to use your microphone?"*, tap **Allow**!

### Testing on Android (Chrome)
- **Direct HTTPS**: Open `https://<YOUR-COMPUTER-IP>:5173/` ➔ tap **Advanced** ➔ **Proceed to unsafe** ➔ grant microphone access.
- **Developer Flag Bypass**: If accessing via plain HTTP (`http://<YOUR-IP>:5173/`):
  1. In Chrome on Android, open `chrome://flags`.
  2. Search for `Insecure origins treated as secure`.
  3. Set to **Enabled**, enter `http://<YOUR-IP>:5173`, and tap **Relaunch**.

---

## 🏗️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler** | [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-basic-ssl` |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite` |
| **Icons & Typography** | [Lucide React](https://lucide.dev/) + Google Fonts (`Fredoka`, `Quicksand`) |
| **Speech Engine** | Native browser [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) |
| **Audio Synthesis** | Native [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (Oscillators, Gain nodes) |
| **Explosion Physics** | HTML5 Canvas 2D + [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Storage** | Browser `localStorage` (Profiles, Word Chests, Custom Words) |

---

## 📂 Project Structure

```
reading-app/
├── public/
├── src/
│   ├── components/
│   │   ├── InventoryModal.tsx      # Child's Word Chest & sticker collection
│   │   ├── ProfileSetupScreen.tsx  # Reader profile creation & avatar picker
│   │   ├── SettingsModal.tsx       # Timer speed, deck selector & custom word inputs
│   │   ├── TimerBar.tsx            # Animated 10s progress bar with audio tick cues
│   │   ├── WordCard.tsx            # Central flashcard, voice mic bubble, hint buttons
│   │   └── WordExplosion.tsx       # HTML5 Canvas 2D letter shattering & particle burst
│   ├── data/
│   │   └── wordLists.ts            # Curated phonics decks (CVC, Sight Words, Animals)
│   ├── hooks/
│   │   └── useSpeechRecognition.ts # Web Speech API manager & homophone matching
│   ├── types/
│   │   └── profile.ts              # Profile and Word collection data contracts
│   ├── utils/
│   │   └── audio.ts                # Web Audio API synthesizers & text-to-speech
│   ├── App.tsx                     # Main game coordinator & state store
│   ├── index.css                   # Tailwind v4 styles & bouncy animations
│   └── main.tsx                    # React application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions, additional phonics decks, sound effects, or translations are very welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
