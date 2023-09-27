import axios from "axios";
import * as cheerio from "cheerio";
import { encode } from "gpt-3-encoder";

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
  const pageTitle = $("title").text();
  console.log(pageTitle);
  
  // App title
  // #tabletGrid > div.page_content_ctn > div > div.page_title_area.game_title_area > h2
  // const pageContent = $("div#tabletGrid > div.page_content_ctn > div.page_title_area.game_title_area > apphub_HomeHeaderContent");
  // const pageContent = $("div#tabletGrid").text();
  // console.log({ pageContent });

  const pageTitleArea = $("div.page_title_area");
  const gameTitle = $(pageTitleArea).find("h2").text();
  console.log({ gameTitle });

};

// gamePage("app/1091500/Cyberpunk_2077/"); // cyberpunk
gamePage("sub/821963"); // megaman