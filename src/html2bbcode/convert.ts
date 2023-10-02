import html2bbcode from "html2bbcode";
import * as fs from "fs";

const { HTML2BBCode } = html2bbcode;

export const convertHtmlToBBCode = async (html: string) => {
  const opts = {
    // enable image scale, default: false
    imagescale: true,
    // enable transform pixel size to size 1-7, default: false
    transsize: true,
    // disable list <ul> <ol> <li> support, default: false
    nolist: false,
    // disable text-align center support, default: false
    noalign: true,
    // disable HTML headings support, transform to size, default: false
    noheadings: false,
  };

  const converter = new HTML2BBCode(opts);
  const bbcode = converter.feed(html);
  return bbcode.toString();
}


(async () => {
  const html = fs.readFileSync("src/test3.html", "utf-8");
  const bbcode = await convertHtmlToBBCode(html);
  fs.writeFileSync("src/test3.md", bbcode);
})();
