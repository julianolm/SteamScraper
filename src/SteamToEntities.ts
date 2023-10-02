import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import { convertHtmlToBBCode } from "@/html2bbcode/convert";

import { Entity } from "@/magna";

const BASE_URL = "https://store.steampowered.com/";

export default async function SteamToEntities(
  gamePageUrl: string
): Promise<Entity[]> {
  const response = await axios.get(BASE_URL + gamePageUrl);
  const html = response.data;
  const $ = cheerio.load(html);

  const gameTitle = $("#appHubAppName").text();
  // This step is important because it prevents the scraper from breaking when
  //  the game page is not accessible due to the age content blocker.
  if (!gameTitle) {
    console.log("No game title found");
    return [];
  }

  const entities: Entity[] = [];

  const shortDescription = $("div.game_description_snippet");
  const shortDescriptionText = shortDescription
    .text()
    .replace(/^\s+|\s+$|\s+(?=\s)/g, "");
  if (shortDescriptionText) {
    entities.push({
      stringKey: "short_description",
      english: shortDescriptionText,
      "pt-BR": "",
    });
  }

  const description = $("div#game_area_description");
  const descriptionHtml = description.html();
  if (descriptionHtml) {
    const descriptionBBCode = await convertHtmlToBBCode(descriptionHtml);
    entities.push({
      stringKey: "about",
      english: descriptionBBCode,
      "pt-BR": "",
    });
  }

  const earlyAccessSection = $("#earlyAccessBody");
  if (earlyAccessSection.length > 0) {
    const earlyAccessDescription = earlyAccessSection
      .find("#devnotes_expander")
      .html();
    const earlyaccessDescriptionBBCode = await convertHtmlToBBCode(
      earlyAccessDescription
    );
    entities.push({
      stringKey: "earlyaccess_description",
      english: earlyaccessDescriptionBBCode,
      "pt-BR": "",
    });
  }

  return entities;
}

(async () => {
  // const res = await SteamToEntities("app/691790/Arcadian_Atlas/?l=portuguese");
  const res = await SteamToEntities("app/2164030/Stop_Dead/");
  console.log(res);
})();
