import { nodeToHtml } from "../api/nodeToHtml";
import { ANode } from "./ANode";

import { ComponentSetNode } from "./ComponentSetNode";
import { ComponentNode } from "./ComponentNode";
import { PageNode } from "./PageNode";
import { VectorNode } from "./VectorNode";
import { TextNode } from "./TextNode";
import { REGISTRY } from "./registry";
import { UsageNode } from "./UsageNode";
import { ComponentSetVariantNode } from "./ComponentSetVariantNode";

Object.assign(REGISTRY, {
  COMPONENT_SET: ComponentSetNode,
  COMPONENT: ComponentNode,
  VECTOR: VectorNode,
  PAGE: PageNode,
  TEXT: TextNode,
  VARIANT: ComponentSetVariantNode,
  USAGE: UsageNode,
});

/**
 * Root Node.
 */
export class RootNode extends ANode {
  toHtml() {
    return nodeToHtml({ tag: "components", nodes: this.nodes });
  }
  toHtmlIf(filterFn: (ANode) => boolean) {
    return nodeToHtml({
      tag: "components",
      nodes: this.nodes?.filter(filterFn),
    });
  }
}
