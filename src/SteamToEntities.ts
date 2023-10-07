import axios from "axios";
import * as cheerio from "cheerio";
import { convertHtmlToBBCode } from "@/BBCode";

import { Entity } from "@/magnaApiMock";

type SteamPageMetadata = {
  title: string;
  titleAsTag: string;
  shortDescriptionImgRef: string;
  pageBackgroundStyle?: string;
};

export default async function SteamToEntities(
  gamePageUrl: string
): Promise<{ entities: Entity[]; metadata: SteamPageMetadata }> {
  const response = await axios.get(gamePageUrl);
  const html = response.data;
  const $ = cheerio.load(html);

  const gameTitle = $("#appHubAppName").text();
  // This step is important because it prevents the scraper from breaking when
  //  the game page is not accessible due to the age content blocker.
  if (!gameTitle) {
    throw new Error("Invalid URL or game page not accessible");
  }
  const titleAsTag = gameTitle
    .replace(/\s+/g, "_")
    .replace(/\W+/g, "")
    .toLowerCase();

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
  const shortDescriptionImgRef = $(
    "div.game_header_image_ctn#gameHeaderImageCtn > img.game_header_image_full"
  ).attr("src");

  const description = $("div#game_area_description");
  const descriptionHtml = description.html();
  if (descriptionHtml) {
    const descriptionBBCode = convertHtmlToBBCode(descriptionHtml);
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
    const earlyaccessDescriptionBBCode = convertHtmlToBBCode(
      earlyAccessDescription
    );
    entities.push({
      stringKey: "earlyaccess_description",
      english: earlyaccessDescriptionBBCode,
      "pt-BR": "",
    });
  }

  const backgroundImage = $("div.game_page_background").attr("style");

  const metadata: SteamPageMetadata = {
    title: gameTitle,
    titleAsTag,
    shortDescriptionImgRef,
    pageBackgroundStyle: backgroundImage ? backgroundImage : undefined,
  };

  return { entities, metadata };
}