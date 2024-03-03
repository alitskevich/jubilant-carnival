import { ANode } from "./ANode";
export class VectorNode extends ANode {
  getHtmlNode() {
    const { id, name, componentName, styling, layout } = this as any;
    const { w = 8, h = 8 } = layout?.bounds ?? {};
    const htmlNode = {
      name,
      tag: "component",
      attrs: { id: componentName },
      nodes: {
        name,
        tag: "svg",
        styling,
        attrs: {
          key: id,
          width: `${w}`,
          height: `${h}`,
          class: `{@class}`,
          viewBox: `0 0 ${w} ${h}`,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
      },
    };

    return htmlNode;
  }
}
