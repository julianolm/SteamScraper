import * as fs from "fs";
import SteamToEntities from "@/SteamToEntities";
import { compareBBCodeStructure, renderBBCode } from "@/BBCode";
import { GAME_URLS } from "@/gameUrls";
import { languageRecord, LocalizeRecords } from "@/magna_api";
import generatePdfFromHtml from "@/PDFGenerator";

const BASE_URL = "https://store.steampowered.com/";

// TO DO
// - Paralelizar as async calls do SteamToEntities

const SteamPageTranslation = async (
  gamePageUrl: string,
  targetLanguage: keyof typeof languageRecord
) => {
  const entities = await SteamToEntities(gamePageUrl);
  const aboutSectionBBCode = entities.find(
    (entity) => entity.stringKey === "about"
  )?.english;

  for (let i = 0; i < 5; i++) {
    const translatedEntities = await LocalizeRecords(
      entities,
      [targetLanguage],
      100, // acho que nao
      {
        max_retries: 3,
        timeout_sec: 10,
        timeout_multiplyer: 2,
        parallel_requests: 10,
      }
    );
    const translatedAboutSectionBBCode = translatedEntities.find(
      (entity) => entity.stringKey === "about"
    )?.targetLanguage;

    const isSameStructure = compareBBCodeStructure(
      aboutSectionBBCode,
      translatedAboutSectionBBCode
    );

    if (isSameStructure) return entities;
  }

  throw new Error(
    `Failed to translate: '${gamePageUrl}'. BBCode structure was corrupted.`
  );
};

function generatePDF(entities) {
  const htmlContent = renderBBCode(entities[1]);
  const pdfPath = "out/output.pdf";
  generatePdfFromHtml(htmlContent, pdfPath)
    .then(() => {
      console.log(`PDF generated at ${pdfPath}`);
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    });
}

(async () => {
  console.log("               Results\n====================================");
  const results = {};
  for (const [gameName, gamePath] of GAME_URLS) {
    const entities = await SteamPageTranslation(gamePath, "pt-BR");
    results[gameName] = entities;
    generatePDF(entities);
    console.log("====================================");
    break;
  }
  fs.writeFileSync("results.json", JSON.stringify(results));
  console.log("\n");
})();
