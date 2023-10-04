import Parser from "@bbob/parser";
import Render from "posthtml-render";

const { parse } = Parser;
const { render } = Render;

export default function renderBBCode(bbcode) {
  const options = {
    onError: (err) =>
      console.warn(err.message, err.lineNumber, err.columnNumber),
  };
  const ast = parse(bbcode, options);
  const html = render(ast);
  return html;
}

function main() {
  const content1 =
    "[url]link[/url][b][h2]some nesting tag[/h2]texto negrito[/b] [img]https://i.imgur.com/1wXjY.jpg[/img]";

  const html = renderBBCode(content1);

  console.log(html);
}

main();
