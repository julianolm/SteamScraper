import * as fs from "fs";
import { hideBBCodeImagesUrls } from "@/BBCode";

function getBaseSteamJson() {
  return {
    language: "",
    itemid: "",
    "app[content][legal]": "",
    "app[content][earlyaccess_description]": "",
    "app[content][about]": "",
    "app[content][short_description]": "",
    "app[content][sysreqs][mac][min][osversion]": "",
    "app[content][sysreqs][mac][min][processor]": "",
    "app[content][sysreqs][mac][min][graphics]": "",
    "app[content][sysreqs][mac][min][soundcard]": "",
    "app[content][sysreqs][mac][min][vrsupport]": "",
    "app[content][sysreqs][mac][min][notes]": "",
    "app[content][sysreqs][mac][req][osversion]": "",
    "app[content][sysreqs][mac][req][processor]": "",
    "app[content][sysreqs][mac][req][graphics]": "",
    "app[content][sysreqs][mac][req][soundcard]": "",
    "app[content][sysreqs][mac][req][vrsupport]": "",
    "app[content][sysreqs][mac][req][notes]": "",
    "app[content][sysreqs][windows][min][osversion]": "",
    "app[content][sysreqs][windows][min][processor]": "",
    "app[content][sysreqs][windows][min][graphics]": "",
    "app[content][sysreqs][windows][min][soundcard]": "",
    "app[content][sysreqs][windows][min][vrsupport]": "",
    "app[content][sysreqs][windows][min][notes]": "",
    "app[content][sysreqs][windows][req][osversion]": "",
    "app[content][sysreqs][windows][req][processor]": "",
    "app[content][sysreqs][windows][req][graphics]": "",
    "app[content][sysreqs][windows][req][soundcard]": "",
    "app[content][sysreqs][windows][req][vrsupport]": "",
    "app[content][sysreqs][windows][req][notes]": "",
    "app[content][sysreqs][linux][min][osversion]": "",
    "app[content][sysreqs][linux][min][processor]": "",
    "app[content][sysreqs][linux][min][graphics]": "",
    "app[content][sysreqs][linux][min][soundcard]": "",
    "app[content][sysreqs][linux][min][vrsupport]": "",
    "app[content][sysreqs][linux][min][notes]": "",
    "app[content][sysreqs][linux][req][osversion]": "",
    "app[content][sysreqs][linux][req][processor]": "",
    "app[content][sysreqs][linux][req][graphics]": "",
    "app[content][sysreqs][linux][req][soundcard]": "",
    "app[content][sysreqs][linux][req][vrsupport]": "",
    "app[content][sysreqs][linux][req][notes]": "",
  };
}

export default async function generateSteamJSON(translatedEntities, target_language, metadata) {
  const baseJson = getBaseSteamJson();
  baseJson.language = target_language;

  const shortDescription = translatedEntities.find((entity) => entity.stringKey === "short_description")[target_language];

  const earlyaccessDescription = translatedEntities.find((entity) => entity.stringKey === "earlyaccess_description")?.[target_language] || "";

  const about = translatedEntities.find((entity) => entity.stringKey === "about")[target_language].replace(/\[h2\].*\[\/h2\]\n/, "");
  const cleanedAbout = await hideBBCodeImagesUrls(about);

  baseJson["app[content][short_description]"] = shortDescription;
  baseJson["app[content][earlyaccess_description]"] = earlyaccessDescription;
  baseJson["app[content][about]"] = cleanedAbout;

  const jsonPath = `out/${metadata.titleAsTag}.json`;
  fs.writeFileSync(jsonPath, JSON.stringify(baseJson));
  console.log(`JSON generated at ${jsonPath}`);
}
