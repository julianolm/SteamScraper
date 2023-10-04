import Parser from "@bbob/parser";

const { parse } = Parser;

function removeStringsFromContent(node) {
  // Base case: If the node is a string, return it as is
  if (typeof node === "string") {
    return node;
  }

  // Process the attributes if needed (you can modify attrs if necessary)

  // Process the content array recursively
  const filteredContent = node.content
    .map((item) => removeStringsFromContent(item))
    .filter((item) => typeof item !== "string");

  // Create a new TagNode without strings in the content
  const filteredNode = {
    tag: node.tag,
  };
  if (filteredContent.length > 0) {
    filteredNode.content = filteredContent;
  }
  return filteredNode;
}

function extractStructure(bbcode) {
  const options = {
    onError: (err) =>
      console.warn(err.message, err.lineNumber, err.columnNumber),
  };
  const ast = parse(bbcode, options);
  const result = removeStringsFromContent({ content: ast });
  return JSON.stringify(result.content);
}

export default function compareBBCodeStructure(bbcode1, bbcode2) {
  // Extract the structure of both Markdown documents
  const structure1 = extractStructure(bbcode1);
  const structure2 = extractStructure(bbcode2);

  // Compare the extracted structures
  return structure1 === structure2;
}

function main() {
  const content1 =
    "[url]link[/url][b][h2]some nesting tag[/h2]texto negrito[/b] [img]https://i.imgur.com/1wXjY.jpg[/img]";
  const content2 = "[b]bold text[/b] [img]https://i.imgur.com/1wXjY.jpg[/img]";
  const content3 =
    "[b]texto negrito[/b] [img]https://i.imgur.com/1wXjY.jpg[/img]";

  console.log(
    "content1 === content2",
    compareBBCodeStructure(content1, content2)
  );
  console.log(
    "content2 === content3",
    compareBBCodeStructure(content2, content3)
  );
}

main();
