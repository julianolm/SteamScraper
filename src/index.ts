import * as fs from "fs";
import SteamToEntities from "@/SteamToEntities";
import { compareBBCodeStructure, renderBBCode, hideBBCodeImagesUrls } from "@/BBCode";
import { languageRecord, LocalizeRecords } from "@/magnaApiMock";
import generatePdfFromHtml from "@/PDFGenerator";
import { Entity } from "@/magnaApiMock";

// TO DO
// - Paralellize the async calls on SteamToEntities can greatly improve performance

async function ExtractSteamPageEntities(gamePageUrl: string) {
  try {
    const { entities, metadata } = await SteamToEntities(gamePageUrl);
    return { entities, metadata };
  } catch (error) {
    console.log(`Error extracting data from: ${gamePageUrl}`);
    throw error;
  }
}

async function SteamPageTranslation(entities: Entity[], targetLanguage: keyof typeof languageRecord) {
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

function generateHTML(entities, targetLanguage, metadata) {
  const shortDescriptionHTML = `
  <h1>${metadata.title}</h1>
  <div class="short-description">
    <img src="${metadata.shortDescriptionImgRef}" />
    <div>
      ${entities[0][targetLanguage]}
    </div>
  </div>
  `;

  const earlyaccessDescriptionHTML =
    entities.length < 3
      ? ""
      : `
        <div class="earlyaccess-container">
          <div class="earlyaccess-title">
            <h1>Early Access Game</h1>
          </div>
          <div class="earlyaccess-description">
            ${renderBBCode(entities[2]?.[targetLanguage])}
          </div>
        </div>
      `;

  const aboutHTML = `<h1>About Section</h1>
  <div class="about">
    ${renderBBCode(entities[1][targetLanguage])}
  </div>`;

  const htmlContent = `<div class="content">${shortDescriptionHTML}${earlyaccessDescriptionHTML}${aboutHTML}</div>`;
  return htmlContent;
}

async function generatePDF(entities, targetLanguage, metadata) {
  const htmlContent = generateHTML(entities, targetLanguage, metadata);
  const pdfPath = `out/${metadata.titleAsTag}.pdf`;
  try {
    const pdfStyles = `
      body {
        ${metadata.pageBackgroundStyle}
        background-position: center top;
        background-repeat: no-repeat;
        background-size: 100vw;
        background-color: #1B2838;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        color: #acb2b8;
      }
      .content {
        width: 90vw;
      }
      .short-description {
        font-family: Arial, Helvetica, sans-serif;
        font-weight: normal;
        font-size: 13px;
        color: #c6d4df;
      }
      .about {
        font-family: "montserrat", Sans-serif;
        font-weight: normal;
        font-size: 14px;
        color: #acb2b8;
      }
      .earlyaccess-container {
        margin-top: 20px;
        border: 1px solid #4e81ae;
      }
      .earlyaccess-title {
        background: linear-gradient(135deg,  rgba(87,164,208,1) 0%,rgba(48,93,122,1) 100%);
        height: 50px;
        display: flex;
        align-items: center;
      }
      .earlyaccess-title h1{
        margin: 0;
        padding: 0 10px;
      }
      .earlyaccess-description {
        font-family: "montserrat", Sans-serif;
        font-style: italic;
        font-weight: normal;
        font-size: 14px;
        color: #8f98a0;
        margin-top: 20px;
        padding: 0 10px;
      }
      .earlyaccess-description h1 {
        font-family: "montserrat", Sans-serif;
        font-style: italic;
        font-weight: normal;
        font-size: 14px;
        color: #fff;
      }
      img {
        width: 66.66vw;
        display: block;
        margin: 20px auto;
      }
      h1 {
        font-family: "montserrat", Sans-serif;
        font-size: 26px;
        color: #fff;
      }
      h2 {
        font-family: "montserrat", Sans-serif;
        font-weight: 300;
        font-size: 14px;
        text-transform: uppercase;
        color: #fff;
        margin: 0 0 10px;
        letter-spacing: 0.03em;
      }
    `;
    const pdf = await generatePdfFromHtml(htmlContent, pdfPath, pdfStyles, metadata);
    console.log(`PDF generated at ${pdfPath}`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

async function generateJSON(translatedEntities, target_language, metadata) {
  const baseJson = {
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

export default async function SteamPageProspectionGenerator(gamePageUrl: string, targetLanguage: keyof typeof languageRecord) {
  if (!Object.keys(languageRecord).find((lang) => lang === targetLanguage)) {
    throw new Error(`Invalid target language: ${targetLanguage}`);
  }
  const { entities, metadata } = await ExtractSteamPageEntities(gamePageUrl);
  const translatedEntities = await SteamPageTranslation(entities, targetLanguage);
  await Promise.all([generatePDF(translatedEntities, targetLanguage, metadata), generateJSON(translatedEntities, targetLanguage, metadata)]);
}

async function main() {
  const gameUrl = "https://store.steampowered.com/app/2164030/Stop_Dead/";
  const target_language = "pt-BR";
  await SteamPageProspectionGenerator(gameUrl, target_language);
}

// main();
