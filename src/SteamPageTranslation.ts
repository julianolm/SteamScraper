import { Entity } from "@/magnaApiMock";
import { languageRecord, LocalizeRecords } from "@/magnaApiMock";
import { compareBBCodeStructure } from "@/BBCode";

export default async function translateSteamEntities(entities: Entity[], targetLanguage: keyof typeof languageRecord) {
  const aboutSectionBBCode = entities.find((entity) => entity.stringKey === "about")?.english;

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
    const translatedAboutSectionBBCode = translatedEntities.find((entity) => entity.stringKey === "about")?.[targetLanguage];

    const isSameStructure = compareBBCodeStructure(aboutSectionBBCode, translatedAboutSectionBBCode);

    if (isSameStructure) return translatedEntities;
  }

  throw new Error(`Failed to translate. BBCode structure was corrupted.`);
}