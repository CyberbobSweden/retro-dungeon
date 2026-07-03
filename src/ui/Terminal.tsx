import { useEffect, useRef, useState } from "react";
import type { LogEntry } from "@/types";

interface Props {
  log: LogEntry[];
  onSubmit: (input: string) => void;
}

const KIND_COLOR: Record<LogEntry["kind"], string> = {
  narration: "text-crt-amber",
  command_echo: "text-crt-amberDim",
  system: "text-crt-blue",
  combat: "text-crt-red",
  dialogue: "text-crt-green",
};

export function Terminal({ log, onSubmit }: Props) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setHistory((h) => [...h, trimmed]);
    setHistoryIdx(null);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === null) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(null);
        setInput("");
      } else {
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  }

  return (
    <div
      className="flex h-full flex-col border border-crt-amberDim/50 bg-crt-panel/60"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-sm leading-relaxed">
        {log.map((entry, i) => (
          <pre
            key={i}
            className={`mb-3 whitespace-pre-wrap font-mono ${KIND_COLOR[entry.kind]} animate-flicker`}
          >
            {entry.text}
          </pre>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-crt-amberDim/40 px-4 py-3">
        <span className="text-crt-amber">{">"}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent font-mono text-crt-amber outline-none placeholder:text-crt-amberDim"
          placeholder="type a command… (try: look)"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="h-4 w-2 animate-blink bg-crt-amber" />
      </div>
    </div>
  );
}
