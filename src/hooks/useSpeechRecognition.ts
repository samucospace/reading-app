import { useState, useEffect, useRef, useCallback } from 'react';

// Extensive kid-speech, homophone, and common speech-to-text misrecognition mappings
const PHONETIC_MAP: Record<string, string[]> = {
  // CVC Words
  CAT: ['KAT', 'CUT', 'CAP', 'COT', 'THAT', 'CHAT', 'TAT', 'CATS', 'KITTY'],
  DOG: ['DOC', 'DOCK', 'DUG', 'DAWG', 'DARK', 'TOG', 'DOGS', 'DOGGY', 'DOGGIE'],
  SUN: ['SON', 'SOME', 'SUNG', 'SAN', 'SIN', 'SUNS', 'SUNNY'],
  PIG: ['BIG', 'PEG', 'PICK', 'FIG', 'PIN', 'PIGS', 'PIGGY'],
  BUG: ['BAG', 'BOG', 'PUG', 'BUD', 'BUZZ', 'BUGS', 'BUGGY'],
  HAT: ['HOT', 'HUT', 'HAD', 'HEART', 'HATS'],
  FOX: ['FOXX', 'FAWKS', 'FOLKS', 'FOCKS', 'BOX', 'FORKS', 'FOXES'],
  CUP: ['CAP', 'COP', 'CUT', 'CUB', 'PUP', 'CUPS'],
  BED: ['BAD', 'BET', 'BEAD', 'HEAD', 'RED', 'BEDS'],
  BAT: ['BAD', 'BET', 'BUT', 'BACK', 'MAT', 'FAT', 'BATS'],
  VAN: ['FAN', 'BAN', 'THEN', 'MAN', 'PAN', 'VANS'],
  NET: ['MET', 'NUT', 'NOT', 'NECK', 'NETS'],
  BOX: ['BOCKS', 'BARK', 'FOX', 'BOTS', 'BOOKS', 'BOXES'],
  POT: ['SPOT', 'PAT', 'PART', 'POP', 'PLOT', 'POTS'],
  RUN: ['RANG', 'RAN', 'ONE', 'WUN', 'RUNS', 'RUNNING'],

  // Sight Words
  THE: ['DA', 'DUH', 'DER', 'D', 'THA', 'THUH'],
  SEE: ['SEA', 'C', 'SI', 'SEEN', 'SEES'],
  YOU: ['U', 'EWE', 'YOO', 'YA', 'YOUR'],
  CAN: ['KEN', 'CON', 'KAN', 'CANS'],
  LOOK: ['LUKE', 'LOCK', 'TOOK', 'BOOK', 'LOOKS'],
  PLAY: ['PRAY', 'CLAY', 'PLEA', 'PLAYS', 'PLAYING'],
  LIKE: ['LIGHT', 'LICK', 'LAKE', 'LIKES'],
  BIG: ['PIG', 'BEG', 'BIK', 'BIGGER'],
  RED: ['READ', 'RAD', 'BED'],
  BLUE: ['BLEW', 'BLOW', 'BOO'],
  JUMP: ['CHUMP', 'DUMP', 'PUMP', 'JUMPS', 'JUMPING'],
  HELP: ['KELP', 'YELP', 'HOP', 'HELPS'],
  AND: ['END', 'AN', 'ANT'],
  WE: ['WII', 'WHEE', 'WEE', 'WEE-WEE'],

  // Animals & 4-letter blends
  STAR: ['START', 'STIR', 'TAR', 'STARS', 'STARRY'],
  MOON: ['MOONEY', 'MUNE', 'NOON', 'MOONS'],
  FROG: ['FOG', 'FLOG', 'ROCK', 'FROGS', 'FROGGY'],
  FISH: ['WISH', 'DISH', 'FIST', 'FISHES', 'FISHING'],
  DUCK: ['DOCK', 'DUG', 'TUCK', 'DUCKS', 'DUCKY'],
  TREE: ['THREE', 'FREE', 'TRAY', 'TREES'],
  LION: ['LINE', 'LYING', 'RYAN', 'LIONS'],
  BEAR: ['BARE', 'BEER', 'PEAR', 'AIR', 'BEARS'],
  BOOK: ['BROOK', 'LOOK', 'BACK', 'BOOKS'],
  BIRD: ['BURD', 'BOARD', 'BYRD', 'BERD', 'BIRDS', 'BIRDY'],
  BOAT: ['BOLT', 'BOOT', 'BOW', 'BOTE', 'BOATS'],
  RAIN: ['REIGN', 'REIN', 'RAYNE', 'RING', 'RAINS', 'RAINY'],
  SNOW: ['SLOW', 'SNO', 'NO', 'SNOWS', 'SNOWY'],

  // High Frequency English Homophones & Near-Sounds
  TO: ['TOO', 'TWO'],
  TWO: ['TO', 'TOO'],
  TOO: ['TO', 'TWO'],
  FOR: ['FOUR', 'FORE'],
  FOUR: ['FOR', 'FORE'],
  ONE: ['WON'],
  WON: ['ONE'],
  BY: ['BUY', 'BYE'],
  BUY: ['BY', 'BYE'],
  BYE: ['BY', 'BUY'],
  NO: ['KNOW'],
  KNOW: ['NO'],
  NEW: ['KNEW'],
  KNEW: ['NEW'],
  WRITE: ['RIGHT'],
  RIGHT: ['WRITE'],
  HERE: ['HEAR'],
  HEAR: ['HERE'],
  THERE: ['THEIR', "THEY'RE"],
  THEIR: ['THERE', "THEY'RE"],
  WOULD: ['WOOD'],
  WOOD: ['WOULD'],
  WHICH: ['WITCH'],
  WITCH: ['WHICH'],
  THROUGH: ['THREW'],
  THREW: ['THROUGH'],
  NIGHT: ['KNIGHT'],
  KNIGHT: ['NIGHT'],
  SEA: ['SEE'],
  ROAD: ['RODE'],
  RODE: ['ROAD'],
  PIECE: ['PEACE'],
  PEACE: ['PIECE'],
  OUR: ['HOUR', 'ARE'],
  HOUR: ['OUR'],
  KNOWS: ['NOSE'],
  NOSE: ['KNOWS'],
  BE: ['BEE', 'B'],
  BEE: ['BE'],
  ARE: ['R', 'OUR'],
  SOME: ['SUM'],
  SUM: ['SOME'],
};

// Levenshtein edit distance
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Normalized phonetic skeleton for kid speech (strips silent or easily swappable consonants)
function getPhoneticSkeleton(str: string): string {
  return str
    .toUpperCase()
    .replace(/[AEIOUY]/g, '') // remove vowels to check consonant frame
    .replace(/[CKQ]/g, 'K')
    .replace(/[SZ]/g, 'S')
    .replace(/[BP]/g, 'P')
    .replace(/[DT]/g, 'T')
    .replace(/(.)\1+/g, '$1'); // collapse duplicate consonants
}

// Checks if a candidate token matches the target word
export function checkSingleTokenMatch(targetWord: string, spokenToken: string, forgiving: boolean = true): boolean {
  if (!targetWord || !spokenToken) return false;

  const target = targetWord.trim().toUpperCase();
  const token = spokenToken.trim().toUpperCase();

  // 1. Exact match
  if (target === token) return true;

  // 2. Homophone / common speech-to-text artifact dictionary
  const alts = PHONETIC_MAP[target] || [];
  if (alts.includes(token)) return true;

  if (!forgiving) return false;

  // 3. Child suffix tolerance (e.g. "CATS" or "CATTY" for "CAT", "DOGGY" for "DOG")
  if (token.startsWith(target) && token.length <= target.length + 3) {
    return true;
  }
  // Reverse: Target has suffix that kid omitted (e.g. "RUN" for "RUNNING")
  if (target.startsWith(token) && target.length - token.length <= 2) {
    return true;
  }

  // 4. Phonetic consonant skeleton match (e.g. "DOG" -> "TG", "DUG" -> "TG")
  const targetSkel = getPhoneticSkeleton(target);
  const tokenSkel = getPhoneticSkeleton(token);
  if (targetSkel.length >= 2 && targetSkel === tokenSkel) {
    return true;
  }

  // 5. Levenshtein edit distance for small typos / accent shifts
  const dist = levenshtein(target, token);
  if (target.length <= 3) {
    // For 3-letter words, allow distance 1 if first or last letter matches
    if (dist === 1 && (target[0] === token[0] || target[target.length - 1] === token[token.length - 1])) {
      return true;
    }
  } else {
    // For 4+ letter words, allow distance 1 or 2 with high similarity
    if (dist <= 1) return true;
    const similarity = 1 - dist / Math.max(target.length, token.length);
    if (similarity >= 0.75) return true;
  }

  return false;
}

// Check if any part of a spoken sentence or alternative matches
export function checkWordMatch(targetWord: string, transcript: string, forgiving: boolean = true): boolean {
  if (!targetWord || !transcript) return false;

  const cleanTarget = targetWord.trim().toUpperCase();

  // Extract clean tokens
  const spokenTokens = transcript
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (spokenTokens.length === 0) return false;

  // Test individual tokens
  for (const token of spokenTokens) {
    if (checkSingleTokenMatch(cleanTarget, token, forgiving)) {
      return true;
    }
  }

  // Test full phrase without spaces (in case speech recognizer merged/split words like "SUN FLOWER" or "C AT")
  const joinedSpoken = spokenTokens.join('');
  if (joinedSpoken.includes(cleanTarget)) {
    return true;
  }

  return false;
}

interface UseSpeechRecognitionProps {
  targetWord: string;
  onSuccess: (matchedWord: string) => void;
  enabled: boolean;
  forgivingMode?: boolean;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence?: number;
}

interface SpeechRecognitionResultLike {
  [index: number]: SpeechRecognitionAlternativeLike;
  length: number;
  isFinal?: boolean;
}

interface SpeechRecognitionEventLike {
  resultIndex?: number;
  results: {
    [index: number]: SpeechRecognitionResultLike;
    length: number;
  };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export function useSpeechRecognition({
  targetWord,
  onSuccess,
  enabled,
  forgivingMode = true,
}: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const isEnabledRef = useRef(enabled);
  const targetWordRef = useRef(targetWord);
  const onSuccessRef = useRef(onSuccess);
  const hasMatchedRef = useRef(false);
  const forgivingModeRef = useRef(forgivingMode);

  isEnabledRef.current = enabled;
  targetWordRef.current = targetWord;
  onSuccessRef.current = onSuccess;
  forgivingModeRef.current = forgivingMode;

  // Reset matched flag when target word changes
  useEffect(() => {
    hasMatchedRef.current = false;
    setTranscript('');
  }, [targetWord]);

  // Initialize Speech Recognition instance
  useEffect(() => {
    const SpeechRecognitionAPI: SpeechRecognitionConstructor | undefined =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      // CRITICAL: Request up to 5 alternative interpretations from the speech model
      recognition.maxAlternatives = 5;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorNotice(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatically resume listening if still in an active round
        if (isEnabledRef.current && !hasMatchedRef.current) {
          try {
            recognition.start();
          } catch {
            // Already active or initializing
          }
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          // Normal background pause
          return;
        }
        if (event.error === 'not-allowed') {
          setErrorNotice('Microphone access blocked. Click "I Said It!" or allow mic.');
        } else {
          setErrorNotice(`Mic notice: ${event.error}`);
        }
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        if (hasMatchedRef.current) return;

        // Collect latest live text for the UI speech bubble
        let latestTranscript = '';
        const target = targetWordRef.current;
        const isForgiving = forgivingModeRef.current;

        const startIndex = event.resultIndex ?? 0;
        for (let i = startIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (!result || result.length === 0) continue;

          // Check primary transcript for UI bubble
          latestTranscript = result[0].transcript;

          // Check ALL alternatives returned by the speech model
          for (let j = 0; j < result.length; j++) {
            const alt = result[j];
            if (!alt || !alt.transcript) continue;

            if (checkWordMatch(target, alt.transcript, isForgiving)) {
              hasMatchedRef.current = true;
              setTranscript(alt.transcript);
              onSuccessRef.current(target);
              return;
            }
          }
        }

        if (latestTranscript) {
          setTranscript(latestTranscript);
        }
      };

      recognitionRef.current = recognition;
    } catch {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Manage start/stop based on enabled prop
  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (enabled) {
      hasMatchedRef.current = false;
      try {
        rec.start();
      } catch {
        // Can fail if already running
      }
    } else {
      try {
        rec.stop();
      } catch {
        // ignore
      }
    }
  }, [enabled]);

  const restartListening = useCallback(() => {
    hasMatchedRef.current = false;
    setTranscript('');
    const rec = recognitionRef.current;
    if (rec && enabled) {
      try {
        rec.abort();
        setTimeout(() => {
          try {
            rec.start();
          } catch {
            // ignore
          }
        }, 80);
      } catch {
        // ignore
      }
    }
  }, [enabled]);

  return {
    isListening,
    transcript,
    isSupported,
    errorNotice,
    restartListening,
  };
}
