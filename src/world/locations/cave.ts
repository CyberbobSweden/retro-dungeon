import type { Location } from "@/types";

export const CAVE_LOCATIONS: Location[] = [
  {
    id: "cave_mouth",
    name: "Cave Mouth",
    region: "forest",
    shortDescription: "A dark opening in the hillside, cool air drifting out.",
    longDescription:
      "The cave entrance is wide enough for three people abreast. The air that " +
      "drifts out smells of wet stone and something faintly metallic. Someone has " +
      "left a torch bracket bolted beside the opening — long empty.",
    exits: [
      { direction: "west", to: "forest_clearing" },
      { direction: "in", to: "cave_tunnel" },
    ],
    tags: ["cave", "threshold"],
    mapPosition: { x: 1, y: -3, z: 0 },
  },
  {
    id: "cave_tunnel",
    name: "Cave Tunnel",
    region: "mine",
    shortDescription: "A rough tunnel, water dripping somewhere ahead.",
    longDescription:
      "The walls are damp limestone, scored with old pick-marks — this tunnel was " +
      "dug by hand, once. Your footsteps echo further than they should.",
    exits: [
      { direction: "out", to: "cave_mouth" },
      { direction: "east", to: "underground_lake" },
      { direction: "down", to: "dungeon_entrance" },
    ],
    monsterIds: ["cave_spider"],
    isDark: true,
    tags: ["cave", "underground"],
    mapPosition: { x: 2, y: -3, z: -1 },
  },
  {
    id: "underground_lake",
    name: "Underground Lake",
    region: "mine",
    shortDescription: "Still black water stretches into the dark.",
    longDescription:
      "The cavern opens into a vast chamber. A lake fills most of it, so still it " +
      "looks solid until a drip breaks the surface somewhere out of sight. Faint " +
      "phosphorescent fungus clings to the far wall, just enough to see by.",
    exits: [{ direction: "west", to: "cave_tunnel" }],
    itemIds: ["silver_ring"],
    features: [
      {
        id: "glowing_fungus",
        name: "fungus",
        description: "Pale blue-green fungus, faintly luminous.",
        interactions: {
          listen: { text: "Water drips somewhere far across the lake. Nothing else moves." },
        },
      },
    ],
    monsterIds: ["giant_spider"],
    isDark: true,
    tags: ["cave", "underground", "water"],
    mapPosition: { x: 3, y: -3, z: -1 },
  },
];
