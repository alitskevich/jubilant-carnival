import { ANode } from "./ANode";
import { FNode } from "../../types";

export const REGISTRY = {};

export function createSubMode(origin: FNode, parent: ANode) {
  const C = REGISTRY[origin?.type] ?? ANode;
  return new C(origin || {}, parent, parent.root ?? parent);
}
