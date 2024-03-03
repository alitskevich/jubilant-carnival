import { ANode } from "./ANode";

export class PageNode extends ANode {
  getHtmlNode() {
    const { id, name, nodes, attrs, componentName } = this as any;

    const htmlNode = {
      name,
      tag: "component",
      attrs: { id: componentName },
      nodes: {
        tag: "article",
        attrs: { ...attrs, key: id },
        classes: ["{@class}"],
        nodes,
      },
    };

    return htmlNode;
  }
}
