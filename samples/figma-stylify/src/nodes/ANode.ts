import type { Hash } from "ultimus/types";
import { qname } from "ultimus";
import type { FNode, NodeLayout, NodeStyling } from "../../types";
import { nodeToHtml } from "../api/nodeToHtml";
import { applyLayout } from "../styling/applyLayout";
import { evaluateNodeStyling } from "../styling";
import { createSubMode } from "./registry";

/**
 * Abstract Node.
 */
export class ANode {
  id = "";
  type: any;
  name = "";
  componentName?: string;
  tag?: string;
  attrs: Hash = {};

  nodes?: ANode[];
  styling?: NodeStyling;
  layout?: NodeLayout;

  addClass: (cl: string | null | undefined, mode?: "layout" | "styling") => void;

  constructor(public data: FNode, public parent?: ANode, public root?: ANode) {
    Object.assign(this, data);
    this.nodes = data.nodes?.map((child: any) => this.createSubMode(child));
    this.addClass = (cl?: string | null, mode = "styling") => {
      if (!cl) return;
      const bundle = this[mode] ?? (this[mode] = {});
      const classes = bundle.classes ?? (bundle.classes = {});
      classes[cl] = "1";
    };
  }

  createSubMode(origin: FNode) {
    return createSubMode(origin, this);
  }

  /**
   * Iterates over each node in the list and applies the provided function.
   *
   * @param {function} applyFn - The function to apply to each node.
   *   - @param {ANode} node - The current node in the iteration.
   *   - @param {ANode} parent - The parent node of the current node.
   * @returns {array} - The result of applying the function to each node.
   */
  eachNode(applyFn: (node: ANode, parent: ANode) => void) {
    return this.nodes?.map((node) => applyFn(node, this));
  }

  evaluateLayout() {
    applyLayout(this);
    this.eachNode((node) => node.evaluateLayout());
  }

  evaluateStyling(context) {
    evaluateNodeStyling(this, context);
    this.eachNode((n) => n.evaluateStyling(context));
  }

  /**
   * Applies a function to the current node and all of its child nodes recursively.
   *
   * @param {(node: ANode, ...args: unknown[]) => void} fn - The function to apply to each node.
   * @param {...unknown[]} args - Additional arguments to pass to the function.
   * @return {void} This function does not return a value.
   */
  apply(fn: (node: ANode, ...args: unknown[]) => void, ...args: unknown[]) {
    fn(this, ...args);
    this.eachNode((n) => n.apply(fn, ...args));
  }

  /**
   * Retrieves the HTML node for the current component.
   *
   * @return {any} The HTML node object.
   */
  getHtmlNode(): any {
    const { id, name, tag = "div", attrs = {}, styling, layout, nodes } = this;
    const key = `${qname(name || 'e')}-${id}`;

    return { tag, attrs: { ...attrs, key }, styling, layout, nodes };
  }

  /**
   * Converts the given node to an HTML string with the specified indentation.
   *
   * @param {string} indent - The indentation string to use.
   * @return {string} The HTML string representation of the node.
   */
  toHtml(indent = "") {
    return nodeToHtml(this.getHtmlNode(), indent);
  }
}
