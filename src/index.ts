import extractSteamPageEntities from "@/SteamToEntities";
import translateSteamEntities from "@/SteamPageTranslation";
import { languageRecord } from "@/magnaApiMock";
import { generateSteamPDF } from "./PDF";
import generateSteamJSON from "./generateSteamJSON";

// TO DO
// - Paralellize the async calls on SteamToEntities can greatly improve performance

export default async function SteamPageProspectionGenerator(gamePageUrl: string, targetLanguage: keyof typeof languageRecord) {
  if (!Object.keys(languageRecord).find((lang) => lang === targetLanguage)) {
    throw new Error(`Invalid target language: ${targetLanguage}`);
  }
  const { entities, metadata } = await extractSteamPageEntities(gamePageUrl);
  const translatedEntities = await translateSteamEntities(entities, targetLanguage);

  await Promise.all([generateSteamPDF(translatedEntities, targetLanguage, metadata), generateSteamJSON(translatedEntities, targetLanguage, metadata)]);
}

async function main() {
  const gameUrl1 = "https://store.steampowered.com/app/742300/Mega_Man_11/";
  const gameUrl2 = "https://store.steampowered.com/app/2164030/Stop_Dead/";
  const target_language = "pt-BR";
  await SteamPageProspectionGenerator(gameUrl1, target_language);
  await SteamPageProspectionGenerator(gameUrl2, target_language);
}

// main();