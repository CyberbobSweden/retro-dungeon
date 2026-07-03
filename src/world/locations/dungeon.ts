import type { Location } from "@/types";

export const DUNGEON_LOCATIONS: Location[] = [
  {
    id: "dungeon_entrance",
    name: "Dungeon Entrance",
    region: "dungeon",
    shortDescription: "A collapsed stair leads down into worked stone.",
    longDescription:
      "Where the cave's natural rock gives way to cut stone, a broken stair spirals " +
      "downward. Someone built this. Someone else, later, tried very hard to seal it.",
    exits: [
      { direction: "up", to: "cave_tunnel" },
      { direction: "down", to: "crypt_corridor" },
    ],
    isDark: true,
    tags: ["dungeon", "underground"],
    mapPosition: { x: 2, y: -3, z: -2 },
  },
  {
    id: "crypt_corridor",
    name: "Crypt Corridor",
    region: "crypt",
    shortDescription: "A long hall lined with sealed alcoves.",
    longDescription:
      "Dozens of stone alcoves line the walls, each sealed with a name-plate too " +
      "worn to read. Dust lies thick except for a single dragged trail down the " +
      "center of the floor — something has been through here recently.",
    exits: [
      { direction: "up", to: "dungeon_entrance" },
      { direction: "east", to: "ossuary" },
      { direction: "west", to: "forgotten_crypt" },
    ],
    monsterIds: ["skeleton_warrior"],
    isDark: true,
    tags: ["crypt", "underground"],
    mapPosition: { x: 2, y: -3, z: -3 },
  },
  {
    id: "ossuary",
    name: "Ossuary",
    region: "crypt",
    shortDescription: "Bones, sorted and stacked with unsettling care.",
    longDescription:
      "Femurs and skulls are arranged floor to ceiling in deliberate patterns — " +
      "not a mass grave, but a monument. Whoever built this wanted the dead " +
      "remembered, or wanted something to feed on them in an orderly fashion.",
    exits: [{ direction: "west", to: "crypt_corridor" }],
    itemIds: ["scroll_of_fireball"],
    monsterIds: ["crypt_wraith"],
    isDark: true,
    tags: ["crypt", "underground"],
    mapPosition: { x: 3, y: -3, z: -3 },
  },
  {
    id: "forgotten_crypt",
    name: "Forgotten Crypt",
    region: "crypt",
    shortDescription: "The air here is colder than it has any right to be.",
    longDescription:
      "A single sarcophagus dominates the room, its lid cracked and shifted, just " +
      "enough to suggest it was opened from the inside. Frost rims every surface " +
      "despite the depth. This is the room from the old map's warning.",
    exits: [{ direction: "east", to: "crypt_corridor" }],
    features: [
      {
        id: "sarcophagus",
        name: "sarcophagus",
        description: "A stone coffin, lid ajar. Cold radiates from the gap.",
        interactions: {
          open: {
            text:
              "Inside, wrapped in rotted silk, lies a wax-sealed letter and a " +
              "seal bearing a crest you don't recognize — yet.",
            grantsItemId: "crypt_seal",
            setsFlag: "opened_forgotten_sarcophagus",
          },
        },
      },
    ],
    monsterIds: ["lich_apprentice"],
    isDark: true,
    tags: ["crypt", "underground", "boss"],
    mapPosition: { x: 1, y: -3, z: -3 },
  },
  {
    id: "sewers_entrance",
    name: "Sewer Entrance",
    region: "sewers",
    shortDescription: "Brick tunnels, ankle-deep in slow water.",
    longDescription:
      "Somewhere below the village, old brickwork gives way to older brickwork. " +
      "The water moving past your boots came from somewhere; where it's going is " +
      "less clear.",
    exits: [
      { direction: "up", to: "well_shaft" },
      { direction: "south", to: "underground_city_gate" },
    ],
    monsterIds: ["gelatinous_cube"],
    isDark: true,
    tags: ["sewers", "underground"],
    mapPosition: { x: 0, y: 1, z: -2 },
  },
  {
    id: "underground_city_gate",
    name: "Gate of the Sunken City",
    region: "underground_city",
    shortDescription: "A vast stone gate, half-buried, still standing.",
    longDescription:
      "Beyond the sewers, the brick gives way to something far older: a gate " +
      "carved with a script no living scholar has translated, tall enough for " +
      "giants and wide enough for armies. Whatever built this expected visitors.",
    exits: [{ direction: "north", to: "sewers_entrance" }],
    monsterIds: ["stone_ogre"],
    isDark: true,
    tags: ["underground_city", "underground", "landmark"],
    mapPosition: { x: 0, y: 2, z: -2 },
  },
];
