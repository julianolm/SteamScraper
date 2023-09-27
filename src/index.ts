import axios from "axios";
import * as cheerio from "cheerio";
import { encode } from "gpt-3-encoder";

import { GAME_URLS } from "src/gameUrls";

const BASE_URL = "https://store.steampowered.com/";

const gamesList = async () => {
  const response = await axios.get(BASE_URL);
  const html = response.data;
  const $ = cheerio.load(html);
  const title = $("title").text();
  console.log(title);
  const games = $("div#tab_newreleases_content > a.tab_item");
  const gamesList = [];
  games.each((i, el) => {
    const game = $(el).find("div.tab_item_name").text();
    const price = $(el).find("div.discount_final_price").text();
    gamesList.push({ game, price });
  });
  console.log(gamesList);
  const encoded = encode("Hello world");
  console.log(encoded);
};

const gamePage = async (gameUrl) => {
  const response = await axios.get(BASE_URL + gameUrl);
  const html = response.data;
  const $ = cheerio.load(html);

  const tabTitle = $("title").text();
  const gameTitle = $("#appHubAppName").text();

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
  const gameDescription = gameAreaDescription
    .clone()
    .find("h2")
    .remove()
    .end()
    .text()
    .replace(/^\s+|\s+$|\s+(?=\s)/g, "");

  console.log({
    tabTitle,
    gameTitle,
    glance_img,
    glance_description,
    game_tags,
    gameDescription,
  });
};

(async () => {
  for (const game of GAME_URLS) {
    await gamePage(game);
    console.log(
      "\n====================================\n====================================\n====================================\n"
    );
  }
})();