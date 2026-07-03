import type { Quest } from "@/types";

export const QUESTS: Record<string, Quest> = {
  quest_the_old_well: {
    id: "quest_the_old_well",
    title: "What Sleeps in the Well",
    description:
      "Elder Maren fears something old lives beneath the village well. Find out what.",
    isMain: true,
    giverNpcId: "elder_maren",
    stages: [
      {
        id: "descend",
        description: "Climb down the well shaft.",
        completeWhenFlag: "entered_well_shaft",
      },
      {
        id: "find_sewers",
        description: "Follow the water to wherever it leads.",
        completeWhenFlag: "entered_sewers_entrance",
      },
      {
        id: "reach_gate",
        description: "Find the source: something ancient beneath the sewers.",
        completeWhenFlag: "entered_underground_city_gate",
      },
    ],
    rewardXp: 150,
    rewardGold: 50,
    rewardItemIds: ["lantern"],
  },
  quest_crypt_seal: {
    id: "quest_crypt_seal",
    title: "The Crest of a Forgotten House",
    description:
      "A sealed letter in a long-undisturbed crypt bears a crest no one living recognizes.",
    isMain: false,
    stages: [
      {
        id: "find_seal",
        description: "Open the sarcophagus in the Forgotten Crypt.",
        completeWhenFlag: "opened_forgotten_sarcophagus",
      },
    ],
    rewardXp: 80,
    rewardItemIds: ["rune_of_warding"],
  },
};

export function getQuest(id: string): Quest | undefined {
  return QUESTS[id];
}
