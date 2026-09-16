import { useState, useEffect, useRef, useCallback } from 'react';

// Common homophones or kid speech variations
const HOMOPHONES: Record<string, string[]> = {
  SUN: ['SON', 'SOME'],
  SEE: ['SEA', 'C', 'SI'],
  RED: ['READ'],
  BLUE: ['BLEW'],
  THE: ['DA', 'THUH'],
  FOR: ['FOUR', 'FORE'],
  TO: ['TWO', 'TOO'],
  ONE: ['WON'],
  BEAR: ['BARE'],
  ME: ['MI'],
  BY: ['BUY', 'BYE'],
  NO: ['KNOW'],
  HERE: ['HEAR'],
  FLOWER: ['FLOUR'],
  KNIGHT: ['NIGHT'],
};

// Check if spoken words match target word
export function checkWordMatch(targetWord: string, transcript: string): boolean {
  if (!targetWord || !transcript) return false;

  const cleanTarget = targetWord.trim().toUpperCase();
  // Clean transcript into words (letters only)
  const spokenWords = transcript
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (spokenWords.length === 0) return false;

  // Direct match in spoken tokens
  if (spokenWords.includes(cleanTarget)) {
    return true;
  }

  // Check homophones / common misrecognitions
  const alternates = HOMOPHONES[cleanTarget] || [];
  for (const alt of alternates) {
    if (spokenWords.includes(alt)) {
      return true;
    }
  }

  // Check if any spoken word contains the target or vice versa (for short words like "CAT" in "CATS")
  for (const spoken of spokenWords) {
    if (spoken === cleanTarget) return true;
    // Handle plural 's' e.g. "CATS" for "CAT" or "DOGS" for "DOG"
    if (spoken.length === cleanTarget.length + 1 && spoken.startsWith(cleanTarget) && spoken.endsWith('S')) {
      return true;
    }
  }

  return false;
}

interface UseSpeechRecognitionProps {
  targetWord: string;
  onSuccess: (matchedWord: string) => void;
  enabled: boolean;
}

interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
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

export function useSpeechRecognition({ targetWord, onSuccess, enabled }: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const isEnabledRef = useRef(enabled);
  const targetWordRef = useRef(targetWord);
  const onSuccessRef = useRef(onSuccess);
  const hasMatchedRef = useRef(false);

  isEnabledRef.current = enabled;
  targetWordRef.current = targetWord;
  onSuccessRef.current = onSuccess;

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
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorNotice(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        // If still supposed to be active and not matched yet, restart listening
        if (isEnabledRef.current && !hasMatchedRef.current) {
          try {
            recognition.start();
          } catch {
            // Already started or busy
          }
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          // Normal timeout waiting for speech, ignore
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

        let liveText = '';
        for (let i = 0; i < event.results.length; i++) {
          liveText += event.results[i][0].transcript + ' ';
        }
        liveText = liveText.trim();
        setTranscript(liveText);

        if (checkWordMatch(targetWordRef.current, liveText)) {
          hasMatchedRef.current = true;
          onSuccessRef.current(targetWordRef.current);
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
        }, 100);
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
