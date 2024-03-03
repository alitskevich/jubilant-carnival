import { ANode } from "./ANode";

export class TextNode extends ANode {
  getHtmlNode() {
    const { id, content: text, layout, styling } = this as any;
    const htmlNode = { tag: "Text", styling, layout, attrs: { text, key: id } };

    return htmlNode;
  }
}
