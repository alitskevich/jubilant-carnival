import { ANode } from "./ANode";

export class ComponentSetNode extends ANode {
  evaluateLayout() {
    this.nodes?.forEach((node) => {
      node.evaluateLayout();
    });
  }

  getHtmlNode() {
    const { id, componentName, name, meta: { properties = [] } = {}, nodes } = this as any;

    const selectorProps = properties?.filter(({ type }) => type === "VARIANT");

    const selectorWhenExpr = selectorProps
      ?.map(({ id, defaultValue }) => `${id}={@${id} ?? '${defaultValue ?? "Default"}'}`)
      .join(",");

    const metaNode = {
      tag: "Meta",
      attrs: { id },
      nodes: {
        tag: "Properties",
        nodes: properties.map((attrs) => {
          return { tag: "Property", attrs };
        }),
      },
    };

    const htmlNode = {
      name,
      tag: "component",
      attrs: { id: componentName },
      nodes: [metaNode].concat(
        selectorProps?.length
          ? {
              tag: "Selector",
              attrs: { on: selectorWhenExpr },
              nodes,
            }
          : nodes.map((n) => n.innerNode())
      ),
    };

    return htmlNode;
  }
}
