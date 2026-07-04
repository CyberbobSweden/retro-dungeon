import { useCallback, useEffect, useRef, useState } from "react";

export interface VoiceControl {
  supported: boolean;
  listening: boolean;
  handsFree: boolean;
  toggleHandsFree: () => void;
  listenOnce: () => void;
  speak: (text: string, onDone?: () => void) => void;
  stopSpeaking: () => void;
}

/**
 * Speech-to-text (Web Speech API `SpeechRecognition`) and text-to-speech
 * (`SpeechSynthesis`), wired into a hands-free loop: listen -> submit ->
 * speak the result -> listen again.
 *
 * Compatibility note: this is well supported in desktop and Android
 * Chrome. It is NOT guaranteed in embedded/automotive browsers (Tesla,
 * Polestar, etc.) — those are locked-down Chromium webviews and some
 * disable microphone access or the speech-recognition backend entirely
 * for in-car use. The hook feature-detects and hides voice controls
 * entirely when unsupported, rather than showing a button that silently
 * fails.
 */
export function useVoiceControl(onCommand: (text: string) => void): VoiceControl {
  const [supported] = useState(
    () => typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const [listening, setListening] = useState(false);
  const [handsFree, setHandsFree] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const handsFreeRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    handsFreeRef.current = handsFree;
  }, [handsFree]);

  useEffect(() => {
    return () => {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    };
  }, []);

  const getRecognition = useCallback((): SpeechRecognitionLike | null => {
    if (!supported) return null;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return null;
    const recognition = new Ctor();
    recognition.lang = typeof navigator !== "undefined" ? navigator.language || "en-US" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    return recognition;
  }, [supported]);

  const listenOnce = useCallback(() => {
    if (!supported) return;
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    const recognition = getRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;

    // Tracks whether this particular listening session produced a result,
    // so onend can tell "the user said something" apart from "silence /
    // no-speech timeout" — mobile browsers end a recognition session after
    // a few seconds of silence even in hands-free mode, and without this
    // the mic would just go dead until the button was pressed again.
    let gotResult = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1]?.[0]?.transcript;
      if (transcript?.trim()) {
        gotResult = true;
        onCommand(transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      setListening(false);
      const fatal = event.error === "not-allowed" || event.error === "service-not-allowed" || event.error === "aborted";
      if (!fatal && handsFreeRef.current) {
        restartTimerRef.current = setTimeout(() => listenOnce(), 500);
      }
    };

    recognition.onend = () => {
      setListening(false);
      // No result this session (silence/timeout) but still in hands-free
      // mode: keep the loop alive by listening again after a short pause.
      // If a result DID come in, the caller's own flow (submit -> speak
      // the response -> listen again) handles the next restart instead,
      // so we don't double-restart on top of that.
      if (!gotResult && handsFreeRef.current) {
        restartTimerRef.current = setTimeout(() => listenOnce(), 500);
      }
    };

    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
    }
  }, [supported, getRecognition, onCommand]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string, onDone?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        onDone?.();
        return;
      }
      // Strip markdown-ish/formatting noise so it reads cleanly aloud.
      const clean = text
        .replace(/[=_*`#]/g, "")
        .replace(/\n+/g, ". ")
        .slice(0, 600);
      if (!clean.trim()) {
        onDone?.();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.onend = () => onDone?.();
      utterance.onerror = () => onDone?.();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const toggleHandsFree = useCallback(() => {
    setHandsFree((prev) => {
      const next = !prev;
      handsFreeRef.current = next;
      if (!next) {
        if (restartTimerRef.current) {
          clearTimeout(restartTimerRef.current);
          restartTimerRef.current = null;
        }
        stopSpeaking();
        recognitionRef.current?.abort();
        setListening(false);
      } else {
        listenOnce();
      }
      return next;
    });
  }, [listenOnce, stopSpeaking]);

  return { supported, listening, handsFree, toggleHandsFree, listenOnce, speak, stopSpeaking };
}
