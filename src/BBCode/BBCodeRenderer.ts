import Parser from "@bbob/parser";
import Render from "posthtml-render";

const { parse } = Parser;
const { render } = Render;

export default function renderBBCode(bbcode: string) {
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

// Modify and run the main function as you need to see how it works
// main();
