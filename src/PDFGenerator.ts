import puppeteer from "puppeteer";

export default async function generatePdfFromHtml(htmlContent, pdfPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content of the page with the provided HTML
  await page.setContent(htmlContent);

  // Generate PDF
  await page.pdf({ path: pdfPath, format: "A4" });

  // Close the browser
  await browser.close();
}

// // Usage example:
// const htmlContent = `
//   <html>
//     <head>
//       <title>Generated PDF</title>
//     </head>
//     <body>
//       <h1>Hello, PDF!</h1>
//       <p>This is a sample HTML content that will be converted into a PDF.</p>
//     </body>
//   </html>
// `;

// const pdfPath = "out/output.pdf";

// generatePdfFromHtml(htmlContent, pdfPath)
//   .then(() => {
//     console.log(`PDF generated at ${pdfPath}`);
//   })
//   .catch((error) => {
//     console.error("Error generating PDF:", error);
//   });
