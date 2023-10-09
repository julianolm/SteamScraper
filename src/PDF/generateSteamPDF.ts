import { Entity, languageRecord } from "@/magnaApiMock";
import generatePdfFromHtml from "./PDFGenerator";
import { renderBBCode } from "@/BBCode";
import { SteamPageMetadata } from "@/SteamToEntities";

function generateHTML(entities: Entity[], targetLanguage: keyof typeof languageRecord, metadata: SteamPageMetadata) {
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
        <div class="section-container">
          <div class="section-title">
            <h1>Early Access Game</h1>
          </div>
          <div class="earlyaccess-description">
            ${renderBBCode(entities[2]?.[targetLanguage])}
          </div>
        </div>
      `;

  const aboutHTML = `
    <div class="section-container">
      <div class="section-title"><h1>About Section</h1></div>
      <div class="about">
        ${renderBBCode(entities[1][targetLanguage])}
      </div>
    </div>`;

  const cssContent = `
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
    .section-container {
      margin-top: 20px;
      border: 1px solid #4e81ae;
    }
    .section-title {
      background: linear-gradient(135deg,  rgba(87,164,208,1) 0%,rgba(48,93,122,1) 100%);
      height: 50px;
      display: flex;
      align-items: center;
    }
    .section-title h1{
      margin: 0;
      padding: 0 10px;
    }
    .about {
      font-family: "montserrat", Sans-serif;
      font-weight: normal;
      font-size: 14px;
      color: #acb2b8;
      padding: 0 10px;
      margin: 20px 0;
    }
    .earlyaccess-description {
      font-family: "montserrat", Sans-serif;
      font-style: italic;
      font-weight: normal;
      font-size: 14px;
      color: #8f98a0;
      padding: 0 10px;
      margin: 20px 0;
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
  const htmlContent = `<div class="content">${shortDescriptionHTML}${earlyaccessDescriptionHTML}${aboutHTML}</div>`;
  return {htmlContent, cssContent};
}

export default async function generateSteamPDF(
  entities: Entity[],
  targetLanguage: keyof typeof languageRecord,
  metadata: SteamPageMetadata
) {
  const { htmlContent, cssContent } = generateHTML(entities, targetLanguage, metadata);
  const pdfPath = `out/${metadata.titleAsTag}.pdf`;
  try {
    await generatePdfFromHtml(htmlContent, pdfPath, cssContent, metadata);
    console.log(`PDF generated at ${pdfPath}`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}
