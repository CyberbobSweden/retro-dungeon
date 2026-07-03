import type { Location } from "@/types";

export const VILLAGE_LOCATIONS: Location[] = [
  {
    id: "village_square",
    name: "Village Square",
    region: "village",
    shortDescription: "The heart of Millbrook, quiet at this hour.",
    longDescription:
      "A cracked cobblestone square, ringed by crooked timber houses. A well sits at " +
      "its center, and somewhere a shutter bangs against its frame in the wind. This " +
      "is the only place in the world that has ever felt entirely safe.",
    exits: [
      { direction: "north", to: "old_well" },
      { direction: "east", to: "blacksmith" },
      { direction: "west", to: "tavern" },
      { direction: "south", to: "village_gate" },
    ],
    itemIds: [],
    npcIds: ["elder_maren"],
    ambientSounds: ["distant chatter", "a dog barking", "wind"],
    isSafe: true,
    tags: ["village", "start"],
    mapPosition: { x: 0, y: 0, z: 0 },
  },
  {
    id: "old_well",
    name: "Old Well",
    region: "village",
    shortDescription: "A stone well, its rope frayed and dark with age.",
    longDescription:
      "The well is older than the village around it, some say older than the forest. " +
      "The stones are worn smooth by hands that no longer exist. Cold air rises from " +
      "the shaft below.",
    exits: [
      { direction: "south", to: "village_square" },
      {
        direction: "down",
        to: "well_shaft",
        hidden: true,
        description: "A narrow shaft, barely wide enough for a person.",
      },
    ],
    features: [
      {
        id: "well_rope",
        name: "rope",
        description: "An old rope, knotted every few feet, disappearing into the dark.",
        searchable: true,
        searchResult: {
          text: "You find the rope is sturdy enough to climb down.",
          revealsExit: "down",
        },
      },
    ],
    isSafe: true,
    tags: ["village", "water"],
    mapPosition: { x: 0, y: 1, z: 0 },
  },
  {
    id: "blacksmith",
    name: "Blacksmith's Forge",
    region: "village",
    shortDescription: "Heat and hammer-song spill from the open forge.",
    longDescription:
      "The forge glows orange even in daylight. Racks of half-finished blades line " +
      "the walls, and the smith — a woman built like the anvils she works — barely " +
      "looks up when you enter.",
    exits: [{ direction: "west", to: "village_square" }],
    npcIds: ["smith_orla"],
    isSafe: true,
    tags: ["village", "shop"],
    mapPosition: { x: 1, y: 0, z: 0 },
  },
  {
    id: "tavern",
    name: "The Broken Wheel Tavern",
    region: "village",
    shortDescription: "Low light, low talk, and the smell of old ale.",
    longDescription:
      "A dozen mismatched tables, most empty. A fire snaps in the hearth. The kind " +
      "of place where travelers trade rumors for a warm meal, if you know how to ask.",
    exits: [{ direction: "east", to: "village_square" }],
    npcIds: ["old_tomas"],
    isSafe: true,
    tags: ["village", "rumor"],
    mapPosition: { x: -1, y: 0, z: 0 },
  },
  {
    id: "village_gate",
    name: "Village Gate",
    region: "village",
    shortDescription: "A weathered timber gate marks the edge of safety.",
    longDescription:
      "Beyond the gate, the road gives way to a dirt track, and the dirt track gives " +
      "way to the forest. A hand-painted sign reads: TRAVEL PAST THIS POINT AT YOUR " +
      "OWN RISK. Someone has carved a tally of names beneath it. It is a long tally.",
    exits: [
      { direction: "north", to: "village_square" },
      { direction: "south", to: "forest_path" },
    ],
    isSafe: true,
    tags: ["village", "threshold"],
    mapPosition: { x: 0, y: -1, z: 0 },
  },
  {
    id: "well_shaft",
    name: "Well Shaft",
    region: "village",
    shortDescription: "A tight stone shaft, dripping and dark.",
    longDescription:
      "Rings of mortared stone spiral down past the reach of any lantern from above. " +
      "The rope creaks under your weight. Something down here is older than the well.",
    exits: [
      { direction: "up", to: "old_well" },
      { direction: "down", to: "sewers_entrance" },
    ],
    isDark: true,
    tags: ["underground", "water"],
    mapPosition: { x: 0, y: 1, z: -1 },
  },
];
