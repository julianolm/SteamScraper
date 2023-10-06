import html2bbcode from "html2bbcode";

const { HTML2BBCode } = html2bbcode;

export default async function convertHtmlToBBCode(html: string): Promise<string> {
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