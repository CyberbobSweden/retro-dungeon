import type { Difficulty, GameState, PlayerClass } from "@/types";
import { characterSystem } from "@/systems/character/CharacterSystem";
import { STARTING_LOCATION_ID } from "@/world/locations";

export function createNewGame(
  playerName: string,
  playerClass: PlayerClass,
  difficulty: Difficulty = "normal"
): GameState {
  const player = characterSystem.createNewPlayer(playerName, playerClass);
  player.currentLocationId = STARTING_LOCATION_ID;

  return {
    player,
    world: {
      visitedLocationIds: new Set(),
      knownLocationIds: new Set([STARTING_LOCATION_ID]),
      locationItemOverrides: {},
      defeatedMonsters: new Set(),
      flags: new Set(),
      revealedExits: new Set(),
    },
    quests: {},
    questProgress: {},
    turnCount: 0,
    log: [],
    unlockedCommands: new Set(["look", "go", "inventory", "stats", "help", "quests"]),
    seed: `${playerName}-${Date.now()}`,
    difficulty,
  };
}
