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