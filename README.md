# Legends of the Deep

A modern retro text adventure — Zork/Colossal Cave/Infocom atmosphere, a
forgiving natural-language parser, RPG progression, and a self-drawing
ASCII map you have to earn first. Runs entirely client-side: React + Vite
+ TypeScript + Tailwind, saves to JSON.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL. Create a character, then type `look` to start.

```bash
npm run build     # production build to dist/
npm run typecheck # strict TS check, no emit
```

## Design pillars (from the brief)

- **No map at first.** You start with nothing. Find `Old Paper` and a
  `Rusty Pencil` and the `map` command unlocks — the ASCII map renders
  itself from wherever you've actually been, with fog of war (`?` for
  known-but-unvisited, blank for undiscovered).
- **A forgiving parser.** `go north`, `north`, `n`, `walk north`, and
  `head north` are all the same command. So are `attack goblin`, `kill
  goblin`, `fight goblin`, `hit goblin`, `stab goblin`. See
  `src/parser/synonyms.ts` — adding a new synonym is a one-line change.
- **Atmosphere over combat spam.** Room text, ambient sound lines, and a
  CRT-styled terminal UI carry the mood; the log tries to read like a
  transcript, not a stat sheet.
- **RPG systems**: seven stats, ten classes, leveling, equipment,
  quests with multi-stage tracking, a loot/rarity system, and a combat
  loop simple enough to stay legible in a text log.

## Architecture

```
retro-dungeon/
├── src/
│   ├── types/            Shared domain model (Location, Item, Monster,
│   │                     GameState, ParsedCommand, ...) — the vocabulary
│   │                     every other module speaks. No logic here.
│   │
│   ├── parser/            Natural-language command parsing
│   │   ├── synonyms.ts        Verb/direction alias tables
│   │   └── Parser.ts          Tokenizer + parser
│   │
│   ├── world/
│   │   ├── locations/         One file per region (village.ts, forest.ts,
│   │   │                      cave.ts, dungeon.ts) + index.ts aggregator
│   │   ├── World.ts            Stateless queries over the world graph
│   │   └── worldGenerator.ts   Procedural filler-room generator (see
│   │                          "Scaling to 1000+ locations" below)
│   │
│   ├── entities/
│   │   ├── items.ts            Item registry
│   │   ├── monsters.ts         Monster registry + scaled-variant generator
│   │   └── npc.ts               NPCs + dialogue trees
│   │
│   ├── data/
│   │   ├── classes.ts          10 playable classes, stats, starting gear
│   │   └── quests.ts           Quest definitions
│   │
│   ├── systems/
│   │   ├── combat/CombatSystem.ts
│   │   ├── inventory/InventorySystem.ts
│   │   ├── character/CharacterSystem.ts   (leveling, XP curve, resting)
│   │   ├── quests/QuestSystem.ts
│   │   ├── map/MapSystem.ts                (ASCII rendering, fog of war)
│   │   └── save/SaveSystem.ts              (JSON save/load, local + file)
│   │
│   ├── engine/
│   │   ├── GameState.ts        New-game state factory
│   │   └── GameEngine.ts       Dispatches ParsedCommand -> systems -> text
│   │
│   └── ui/                    React components (terminal, status bar,
│                               sidebar tabs, character creation)
│
├── index.html, vite.config.ts, tailwind.config.ts, tsconfig.json
└── README.md
```

**Nothing is monolithic.** The engine never touches raw location data —
it goes through `World`. The UI never touches game logic — it calls
`GameEngine.execute(input)` and renders the returned text plus the
current `GameState`. Every system is independently testable and
independently replaceable.

## Scaling to 1000+ locations

The current build ships a hand-authored, fully connected slice (village
→ forest → dark forest → cave → dungeon → crypt → sewers → underground
city gate) so the whole loop — explore, fight, loot, quest, map — is
playable end to end. Growing this to the design doc's 1000+ rooms is a
content problem, not an architecture problem:

1. **Keep hand-authoring landmarks.** Bosses, quest hubs, and unique
   set-pieces stay hand-written, one region file at a time, exactly like
   `village.ts` / `forest.ts` / `cave.ts` / `dungeon.ts`.
2. **Generate the connective tissue.** `src/world/worldGenerator.ts`
   deterministically (seeded) generates filler corridors between
   landmarks from per-region vocabulary pools, using the exact same
   `Location` shape — the engine can't tell a generated room from a
   hand-written one.
3. **Load regions lazily.** Convert the static imports in
   `world/locations/index.ts` to `import()` calls per region so the
   client only holds the current region (+ neighbors) in memory.
4. **Optional: AI-authored flavor text at runtime**, per the brief's
   "Future AI Features" idea — the *graph* (which rooms connect to which,
   what's in them) stays deterministic and hand-designed for puzzle
   integrity; only the prose description would be swapped for an LLM
   call, keyed by room id + a short context prompt, with the
   hand-written text as a fallback.

## Monster roster

20 hand-authored monsters spanning goblinoids, undead, spiders, oozes,
demons, dragons, and a final boss, plus `generateVariant()` in
`entities/monsters.ts`, which produces Weak/Elder/Ancient tiers of any
base monster on demand — the mechanism for reaching "300+ distinct
encounters" without hand-authoring 300 stat blocks.

## Command reference

Movement: `go <dir>` / bare direction / `n,s,e,w,u,d`, `climb`, `enter`, `leave`
Senses: `look`, `look <direction>`, `inspect <thing>`, `search`, `listen`, `smell`, `taste`
Items: `take`, `drop`, `wear`/`equip`, `remove`/`unequip`, `inventory`, `use`, `drink`, `eat`
Combat: `attack` (`kill`/`fight`/`hit`/`stab` all work), `cast <spell>`, `flee`
World interaction: `open`, `close`, `unlock`, `push`, `pull`, `read`, `pray`, `sit`, `dig`
Social: `talk <npc>`, `ask <npc> about <topic>`, `buy <item>`
Meta: `stats`, `quests`, `map`, `journal`, `rest`, `save`, `help`, `hint`

## Roadmap (from the brief, not yet built)

- Node.js/Express backend, accounts, cloud save, multiplayer/co-op
- Full 1000+ room world via the generator pipeline above
- Full ~300 monster roster via tiered generation across all families
- Crafting (`craft`, `combine`) and full economy loop
- Runtime AI-generated side quests and dialogue variation
- Audio layer (ambient loops per the brief: wind, dripping water, chains,
  distant screams, thunder, low ambient dungeon drone)
