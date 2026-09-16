// Web Audio API Synthesizer & Speech Synthesis for WordPop!

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Bubbly cheerful pop when button is tapped
export function playPopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.09);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  } catch {
    // Ignore audio failures
  }
}

// Grand celebratory explosion fanfare (major chord arpeggio + sparkle shimmer)
export function playSuccessExplosionSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const startTime = now + idx * 0.055;

      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.04, startTime + 0.35);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });

    // Add bright sparkle noise burst
    const noiseOsc = ctx.createOscillator();
    const noiseGain = ctx.createGain();
    noiseOsc.type = 'sine';
    noiseOsc.frequency.setValueAtTime(1600, now);
    noiseOsc.frequency.exponentialRampToValueAtTime(2600, now + 0.22);
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    noiseOsc.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseOsc.start(now);
    noiseOsc.stop(now + 0.3);
  } catch {
    // Ignore audio failures
  }
}

// Soft gentle tick chime when countdown is running low
export function playTickSound(pitch: number = 620) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(pitch, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // Ignore audio failures
  }
}

// Gentle encouraging "try again" chime when time runs out
export function playTimeoutSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const notes = [440, 392]; // A4 -> G4
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const startTime = now + idx * 0.12;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch {
    // Ignore audio failures
  }
}

// Speech synthesis pronunciation helper
export function speakWord(word: string, rate: number = 0.85) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
    utterance.rate = rate;
    utterance.pitch = 1.15;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v =>
      v.lang.startsWith('en') && (
        v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Zira') ||
        v.name.includes('Jenny')
      )
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis unavailable
  }
}
