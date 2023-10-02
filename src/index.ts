import axios from "axios";
import * as cheerio from "cheerio";
import { encode } from "gpt-3-encoder";
import * as fs from "fs";
import { convertHtmlToBBCode } from "@/html2bbcode/convert";

import { GAME_URLS } from "@/gameUrls";

const BASE_URL = "https://store.steampowered.com/";

// type GamePage = {
//   title: string;
//   url: string;
//   content: string;
//   glance_content: string;
//   length: number;
//   tokens: number;
//   chunks: GameChunk[];
//   imgRefs: string[];
// };

type GamePage = {
  title: string;
  url: string;
  content: string;
  glance_content: string;
  game_tags: string[];
};

type GameChunk = {
  game_title: string;
  game_url: string;
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

const cleanImgRef = (imgRef: string) => {
  const pathStart = imgRef.indexOf("/extras");
  const queryStart = imgRef.indexOf("?");
  const cleanedPath =
    queryStart !== -1
      ? imgRef.slice(pathStart, queryStart)
      : imgRef.slice(pathStart);
  return `{STEAM_APP_IMAGE}${cleanedPath}`;
};

const getGamePage = async (gamePageUrl: string) => {
  const response = await axios.get(BASE_URL + gamePageUrl);
  const html = response.data;
  const $ = cheerio.load(html);

  const gameTitle = $("#appHubAppName").text();
  if (!gameTitle) {
    console.log("No game title found");
    return;
  }

  const glance_img = $(
    "div.game_header_image_ctn#gameHeaderImageCtn > img.game_header_image_full"
  ).attr("src");
  const glance_description = $("div.game_description_snippet")
    .text()
    .replace(/^\s+|\s+$|\s+(?=\s)/g, "");
  const glance_game_tags = $(".glance_tags.popular_tags > a");

  const game_tags = [];
  for (const tag of glance_game_tags) {
    const tagText = $(tag).text();
    const cleanedTag = tagText.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
    game_tags.push(cleanedTag);
  }

  const gameAreaDescription = $("div#game_area_description");

  const images = gameAreaDescription.find("img");
  for (const img of images) {
    img.attribs.src = cleanImgRef(img.attribs.src);
  }

  const descriptionHtml = gameAreaDescription.html();
  const descriptionBBCode = await convertHtmlToBBCode(descriptionHtml);
  const descriptionTokens = encode(descriptionBBCode);

  const titleAsTag = gameTitle
    .replace(/\s+/g, "_")
    .replace(/\W+/g, "")
    .toLowerCase();

  const gamePage: GamePage = {
    title: gameTitle,
    url: BASE_URL + gamePageUrl,
    content: descriptionBBCode,
    glance_content: glance_description,
    game_tags,
  };

  fs.writeFileSync(`out/${titleAsTag}.html`, descriptionHtml);
  fs.writeFileSync(`out/${titleAsTag}.bbcode.md`, descriptionBBCode);
  fs.writeFileSync(`out/${titleAsTag}.json`, JSON.stringify(gamePage));

  console.log(gameTitle);
  console.log("Description tokens:", descriptionTokens.length);

  // return gamePage;
};

(async () => {
  console.log("               Results\n====================================");
  for (const game of GAME_URLS) {
    await getGamePage(game);
    console.log("====================================");
  }
  console.log("\n");
})();
