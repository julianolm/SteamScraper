import Parser from "@bbob/parser";
import Render from "posthtml-render";
import { TagNode } from "./BBCodeComparator";

const { parse } = Parser;
const { render } = Render;

function setImageSources(node: TagNode) {
  // if the node is a img tag, set the src attribute
  if(node.tag === "img") {
    node.attrs.src = node.content[0];
    node.content = [];
    return;
  }

  // Process the content array recursively
  const mapContent = node.content
    .map((item) =>
      typeof item === "string" ? item : setImageSources(item)
    )
}

export default function renderBBCode(bbcode: string) {
  const options = {
    onError: (err) =>
      console.warn(err.message, err.lineNumber, err.columnNumber),
  };
  const ast = parse(bbcode, options);
  const root: TagNode = { tag: "", content: ast };
  setImageSources(root);
  const html = render(root.content);
  return html;
}