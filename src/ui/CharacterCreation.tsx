import { useState } from "react";
import type { PlayerClass } from "@/types";
import { CLASSES } from "@/data/classes";

interface Props {
  onCreate: (name: string, playerClass: PlayerClass) => void;
}

export function CharacterCreation({ onCreate }: Props) {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-y-auto p-4">
      <div className="w-full max-w-2xl border border-crt-amberDim/50 bg-crt-panel/60 p-6 font-mono text-crt-amber">
        <pre className="mb-4 text-center text-[10px] leading-tight opacity-80 sm:text-xs">
{String.raw`##################################################
             LEGENDS OF THE DEEP
##################################################`}
        </pre>
        <p className="mb-6 text-sm opacity-80">
          No map. No journal. Just a torch, a class, and whatever's down there.
        </p>

        <label className="mb-1 block text-xs uppercase tracking-wide opacity-70">Your name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="Enter your name…"
          className="mb-6 w-full border border-crt-amberDim/50 bg-transparent px-3 py-2 outline-none placeholder:text-crt-amberDim focus:border-crt-amber"
        />

        <label className="mb-2 block text-xs uppercase tracking-wide opacity-70">Choose your class</label>
        <div className="mb-6 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
          {(Object.keys(CLASSES) as PlayerClass[]).map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`border px-2 py-2 text-left text-xs transition-colors ${
                selectedClass === cls
                  ? "border-crt-amber bg-crt-amberDim/30"
                  : "border-crt-amberDim/40 hover:border-crt-amber"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {selectedClass && (
          <p className="mb-6 text-xs italic opacity-70">{CLASSES[selectedClass].description}</p>
        )}

        <button
          disabled={!name.trim() || !selectedClass}
          onClick={() => selectedClass && onCreate(name.trim(), selectedClass)}
          className="w-full border border-crt-amber px-4 py-3 uppercase tracking-widest text-crt-amber transition-colors hover:bg-crt-amberDim/30 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Begin
        </button>
      </div>
    </div>
  );
}
