import puppeteer from "puppeteer";

export default async function generatePdfFromHtml(htmlContent, pdfPath, styles) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const fullPageHtmlContent = `
  <html>
    <head>
      <title>Generated PDF</title>
      <style>
        ${styles}
      </style>
    </head>
    <body>
      <div class="content">
        ${htmlContent}
      </div
    </body>
  </html>
`;

  // Set the content of the page with the provided HTML
  await page.setContent(fullPageHtmlContent);

  // Generate PDF
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true, // Ensure background colors and images are included
    timeout: 240000,
    margin: {
      top: "50",
      right: "50",
      bottom: "50",
      left: "50",
    },
    scale: 1,
  });

  // Close the browser
  await browser.close();
}
