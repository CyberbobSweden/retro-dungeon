import { useCallback, useMemo, useState } from "react";
import type { GameState, PlayerClass } from "@/types";
import { createNewGame } from "@/engine/GameState";
import { GameEngine } from "@/engine/GameEngine";
import { world } from "@/world/World";
import { CharacterCreation } from "@/ui/CharacterCreation";
import { StatusBar } from "@/ui/StatusBar";
import { Terminal } from "@/ui/Terminal";
import { Sidebar } from "@/ui/Sidebar";
import { saveSystem } from "@/systems/save/SaveSystem";

const INTRO_TEXT =
  "You have no map.\n\nThe village of Millbrook is quiet around you. Somewhere south, " +
  "the road gives way to forest, and the forest gives way to something older.\n\n" +
  "Type `help` for commands, or just start with `look`.";

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);

  const startGame = useCallback((name: string, playerClass: PlayerClass) => {
    const state = createNewGame(name, playerClass);
    state.log.push({ turn: 0, text: `Welcome, ${name} the ${playerClass}.`, kind: "system" });
    state.log.push({ turn: 0, text: INTRO_TEXT, kind: "narration" });
    const loc = world.getLocation(state.player.currentLocationId);
    if (loc) {
      state.log.push({
        turn: 0,
        text: `== ${loc.name} ==\n${loc.longDescription}`,
        kind: "narration",
      });
    }
    const newEngine = new GameEngine(state);
    setEngine(newEngine);
    setGameState({ ...state });
  }, []);

  const handleCommand = useCallback(
    (input: string) => {
      if (!engine) return;
      engine.execute(input);
      setGameState({ ...engine.getState() });
    },
    [engine]
  );

  const handleLoadState = useCallback((loaded: GameState) => {
    const newEngine = new GameEngine(loaded);
    setEngine(newEngine);
    setGameState({ ...loaded });
  }, []);

  const autoLoadIfAvailable = useMemo(() => saveSystem.hasLocalSave(), []);

  if (!gameState || !engine) {
    return (
      <div className="relative min-h-screen bg-crt-bg">
        <div className="crt-overlay" />
        <div className="crt-vignette" />
        <CharacterCreation onCreate={startGame} />
        {autoLoadIfAvailable && (
          <button
            className="fixed bottom-4 right-4 z-10 border border-crt-amberDim/50 bg-crt-panel px-3 py-2 font-mono text-xs text-crt-amber hover:bg-crt-amberDim/30"
            onClick={() => {
              const loaded = saveSystem.loadFromLocalStorage();
              if (loaded) handleLoadState(loaded);
            }}
          >
            Continue saved game
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-crt-bg p-3 sm:p-4">
      <div className="crt-overlay" />
      <div className="crt-vignette" />
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-6xl flex-col gap-3">
        <StatusBar state={gameState} />
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden md:grid-cols-[1fr_320px]">
          <Terminal log={gameState.log} onSubmit={handleCommand} />
          <Sidebar state={gameState} onCommand={handleCommand} onLoadState={handleLoadState} />
        </div>
      </div>
    </div>
  );
}
