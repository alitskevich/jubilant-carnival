import { isValuable, mapEntries } from "ultimus";

export function dehydrateObject(node) {
  if (node == null) return null;

  if (Array.isArray(node)) return node.map(dehydrateObject) as any;

  mapEntries(node, (key, value) => {
    const val = typeof value === "object" ? dehydrateObject(value) : value;
    if (!isValuable(val)) {
      delete node[key];
    }
  });

  return node;
}
