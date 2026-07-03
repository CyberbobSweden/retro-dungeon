import type { Location } from "@/types";

export const FOREST_LOCATIONS: Location[] = [
  {
    id: "forest_path",
    name: "Forest Path",
    region: "forest",
    shortDescription: "A narrow trail winds between old pines.",
    longDescription:
      "Sunlight breaks through the canopy in thin, moving shafts. The path is well " +
      "worn near the village, less so the farther you look. Birdsong thins out to " +
      "the south.",
    exits: [
      { direction: "north", to: "village_gate" },
      { direction: "south", to: "forest_clearing" },
      { direction: "east", to: "hunters_camp" },
    ],
    ambientSounds: ["birdsong", "rustling leaves", "creaking branches"],
    tags: ["forest", "surface"],
    mapPosition: { x: 0, y: -2, z: 0 },
  },
  {
    id: "hunters_camp",
    name: "Hunter's Camp",
    region: "forest",
    shortDescription: "A cold fire pit and a lean-to, long abandoned.",
    longDescription:
      "Whoever camped here left in a hurry. A rusted skinning knife lies half-buried " +
      "in the dirt, and the lean-to has partially collapsed under a season of rain.",
    exits: [{ direction: "west", to: "forest_path" }],
    itemIds: ["rusty_dagger", "ration"],
    features: [
      {
        id: "cold_firepit",
        name: "fire pit",
        description: "Ash and charred wood, cold for a long time now.",
        searchable: true,
        searchResult: { text: "Buried in the ash, your fingers find a few coins.", itemIds: ["gold_coin_pile"] },
      },
    ],
    tags: ["forest", "surface"],
    mapPosition: { x: 1, y: -2, z: 0 },
  },
  {
    id: "forest_clearing",
    name: "Forest Clearing",
    region: "forest",
    shortDescription: "A wide clearing under an open sky.",
    longDescription:
      "Wildflowers push up through old, flattened grass. At the clearing's far edge, " +
      "the trees grow closer together and noticeably darker, as if the forest itself " +
      "changes its mind here.",
    exits: [
      { direction: "north", to: "forest_path" },
      { direction: "south", to: "dark_forest_edge" },
      { direction: "east", to: "cave_mouth" },
    ],
    monsterIds: ["goblin_scout"],
    tags: ["forest", "surface"],
    mapPosition: { x: 0, y: -3, z: 0 },
  },
  {
    id: "dark_forest_edge",
    name: "Dark Forest Edge",
    region: "dark_forest",
    shortDescription: "The trees close overhead. The light drops away.",
    longDescription:
      "It is not yet night, but you would not know it here. The trees grow tangled " +
      "and close, roots knotting across the path like something trying to keep you " +
      "out — or keep something else in.",
    exits: [
      { direction: "north", to: "forest_clearing" },
      { direction: "south", to: "ruined_shrine", hidden: true },
    ],
    features: [
      {
        id: "carved_root",
        name: "carved root",
        description: "A root has been carved with a spiral, deliberately, long ago.",
        onInspect:
          "The spiral matches nothing you've seen — except, faintly, the shape burned into your torch handle.",
        searchable: true,
        searchResult: {
          text: "Following the spiral's direction, you spot a path you missed before.",
          revealsExit: "south",
        },
      },
    ],
    ambientSounds: ["silence", "a distant crack of wood", "something breathing"],
    monsterIds: ["cave_spider"],
    isDark: true,
    tags: ["forest", "surface", "eerie"],
    mapPosition: { x: 0, y: -4, z: 0 },
  },
  {
    id: "ruined_shrine",
    name: "Ruined Shrine",
    region: "ruins",
    shortDescription: "Moss-covered stones, arranged with old intent.",
    longDescription:
      "Four standing stones lean toward a fifth, fallen one at the center. Faded " +
      "carvings suggest a god no one living remembers the name of. The air here is " +
      "very still.",
    exits: [{ direction: "north", to: "dark_forest_edge" }],
    features: [
      {
        id: "fallen_stone",
        name: "fallen stone",
        synonyms: ["altar", "stone"],
        description: "A cracked stone slab, half-sunk into the earth.",
        interactions: {
          pray: {
            text:
              "You kneel and speak a prayer to a god with no name. For a moment, " +
              "you feel steadier than you have in days.",
            setsFlag: "prayed_at_shrine",
          },
        },
      },
    ],
    itemIds: ["ancient_tome"],
    isSafe: true,
    tags: ["ruins", "surface"],
    mapPosition: { x: 0, y: -5, z: 0 },
  },
];
