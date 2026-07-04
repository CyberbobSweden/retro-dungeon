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

  useEffect(() => {
    handsFreeRef.current = handsFree;
  }, [handsFree]);

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
    if (!supported || listening) return;
    const recognition = getRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1]?.[0]?.transcript;
      if (transcript?.trim()) onCommand(transcript.trim());
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    setListening(true);
    recognition.start();
  }, [supported, listening, getRecognition, onCommand]);

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
      if (!next) {
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
