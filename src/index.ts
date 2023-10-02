import SteamToEntities from "@/SteamToEntities";

import { GAME_URLS } from "@/gameUrls";

const BASE_URL = "https://store.steampowered.com/";

// TO DO
// - Paralelizar as async calls do SteamToEntities
// - Verificar se os language codes nas Entities estao corretos

const SteamPageTranslation = async (gamePageUrl: string) => {
  const entities = await SteamToEntities(gamePageUrl);
  // traduzir as entities usando a api da magna

};

(async () => {
  console.log("               Results\n====================================");
  for (const game of GAME_URLS) {
    await SteamPageTranslation(game);
    console.log("====================================");
  }
  console.log("\n");
})();
