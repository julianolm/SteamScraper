import Parser from "@bbob/parser";

const { parse } = Parser;

export type TagNode = {
  tag: string;
  attrs?: any;
  content?: Array<TagNode | string>;
};

function removeStringsFromContent(node: TagNode) {
  // Process the content array recursively
  const filteredContent = node.content
    .map((item) =>
      typeof item === "string" ? item : removeStringsFromContent(item)
    )
    .filter((item) => typeof item !== "string");

  // Create a new TagNode without strings in the content
  const filteredNode: TagNode = {
    tag: node.tag,
  };
  if (filteredContent.length > 0) {
    filteredNode.content = filteredContent;
  }
  return filteredNode;
}

function extractStructure(bbcode: string) {
  const options = {
    onError: (err) =>
      console.warn(err.message, err.lineNumber, err.columnNumber),
  };
  const ast = parse(bbcode, options);
  const root: TagNode = { tag: "", content: ast };
  const result = removeStringsFromContent(root);
  return JSON.stringify(result.content);
}

export default function compareBBCodeStructure(
  bbcode1: string,
  bbcode2: string
) {
  // Extract the structure of both Markdown documents
  const structure1 = extractStructure(bbcode1);
  const structure2 = extractStructure(bbcode2);

  // Compare the extracted structures
  return structure1 === structure2;
}