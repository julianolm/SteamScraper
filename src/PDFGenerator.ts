import puppeteer from "puppeteer";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import * as fs from "fs";
const MARGIN = 60;

async function fillDocumentMargins(pdfPath: string) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const marginHeight = MARGIN * 0.75;
  const marginWidth = MARGIN * 0.75;
  const color = rgb(
    0.10588235294117647,
    0.1568627450980392,
    0.2196078431372549
  );

  const logoBytes = await fs.readFileSync("src/assets/magna-logo.png");
  const logo = await pdfDoc.embedPng(logoBytes);
  const logoDims = logo.scale(0.55);

  const iconBytes = await fs.readFileSync("src/assets/magna-icon.png");
  const icon = await pdfDoc.embedPng(iconBytes);
  const iconDims = icon.scale(0.35);

  const pages = pdfDoc.getPages();
  for (const [i, page] of pages.entries()) {
    // Top margin
    page.drawRectangle({
      x: 0,
      y: page.getHeight() - marginHeight,
      width: page.getWidth(),
      height: marginHeight,
      color,
    });
    // Top logo
    page.drawImage(logo, {
      x: (page.getWidth() - logoDims.width) / 2,
      y: page.getHeight() - (logoDims.height + marginHeight) / 2,
      width: logoDims.width,
      height: logoDims.height,
      opacity: 0.75,
    });

    // Bottom margin
    page.drawRectangle({
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: marginHeight,
      color,
    });
    // Bottom icon
    page.drawImage(icon, {
      x: (page.getWidth() - iconDims.width) / 2,
      y: (marginHeight - iconDims.height) / 2,
      width: iconDims.width,
      height: iconDims.height,
      opacity: 0.75,
    });

    // Left
    page.drawRectangle({
      x: 0,
      y: 0,
      width: marginWidth,
      height: page.getHeight(),
      color,
    });

    // Right
    page.drawRectangle({
      x: page.getWidth() - marginWidth,
      y: 0,
      width: marginWidth,
      height: page.getHeight(),
      color,
    });
  }

  // const firstPage = pages[0];
  // firstPage.drawImage(logo, {
  //   x: (firstPage.getWidth() - logoDims.width) / 2,
  //   y: firstPage.getHeight() - (logoDims.height + marginHeight) / 2,
  //   width: logoDims.width,
  //   height: logoDims.height,
  //   opacity: 1,
  // });

  // firstPage.drawImage(icon, {
  //   x: (firstPage.getWidth() - iconDims.width) / 2,
  //   y: (marginHeight - iconDims.height) / 2,
  //   width: iconDims.width,
  //   height: iconDims.height,
  //   opacity: 1,
  // });

  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, modifiedPdfBytes);
}

export default async function generatePdfFromHtml(htmlContent, pdfPath, styles, metadata) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const fullPageHtmlContent = `
  <html>
    <head>
      <title>${metadata.title}</title>
      <link rel="stylesheet" href="https://use.typekit.net/jxq1srz.css">
      <style>
        ${styles}
      </style>
    </head>
    <body>
        ${htmlContent}
    </body>
  </html>
`;

  // Set the content of the page with the provided HTML
  await page.setContent(fullPageHtmlContent);

  // Generate PDF
  await page.pdf({
    path: pdfPath,
    printBackground: true, // Ensure background colors and images are included
    timeout: 240000,
    margin: {
      top: MARGIN,
      right: MARGIN,
      bottom: MARGIN,
      left: MARGIN,
    },
  });

  // Close the browser
  await browser.close();

  await fillDocumentMargins(pdfPath);
}
