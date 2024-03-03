import { ANode } from "./ANode";

export class UsageNode extends ANode {
  getHtmlNode() {
    const { id, componentName: tag, attrs, layout } = this as any;
    const htmlNode = { tag, layout, attrs: { ...attrs, key: id } };

    return htmlNode;
  }
}
