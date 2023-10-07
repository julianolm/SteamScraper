import Parser from "@bbob/parser";
import Render from "posthtml-render";
import { TagNode } from "./BBCodeComparator";
import convertHtmlToBBCode from "./HtmlToBBCode";

const { parse } = Parser;
const { render } = Render;

function cleanImgRef(imgRef: string) {
  const pathStart = imgRef.indexOf("/extras");
  const queryStart = imgRef.indexOf("?");
  const cleanedPath =
    queryStart !== -1
      ? imgRef.slice(pathStart, queryStart)
      : imgRef.slice(pathStart);
  return `{STEAM_APP_IMAGE}${cleanedPath}`;
}

function changeImageSources(node: TagNode) {
  // if the node is a img tag, set the src attribute
  if (node.tag === "img") {
    node.attrs.src = cleanImgRef(node.content[0] as string);
    node.content = [];
    return;
  }

  // Process the content array recursively
  const mapContent = node.content.map((item) =>
    typeof item === "string" ? item : changeImageSources(item)
  );
}

export function hideBBCodeImagesUrls(bbcode: string) {
  const options = {
    onError: (err) =>
      console.warn(err.message, err.lineNumber, err.columnNumber),
  };
  const ast = parse(bbcode, options);
  const root: TagNode = { tag: "", content: ast };
  changeImageSources(root);
  const html = render(root.content);
  return convertHtmlToBBCode(html);
}