import { adoptProperties, getBounds, guardValuable, selectorCaseKey, toComponentName, toPropertyName } from "../utils";
import { FNode, NormalizedNode } from "../../types";
import { LAYOUT_DEFAULTS, STYLE_DEFAULTS, stylify } from "./stylify";
import { dehydrateObject } from "../utils/dehydrateObject";
import { Hash } from "ultimus";

/**
 * Normalizes the raw input data from Figma REST API v.1.
 *
 * @param {any} input - The input data to be normalized.
 * @return {any} The normalized output data.
 */
export function normalizeInput(input: any = {}) {
  if (input.nodes) {
    return Object.values(input.nodes ?? {}).reduce((r, node) => {
      return normalizeInput(node);
    }, []);
  }

  const { components, componentSets, document, styles, ...metaInfo } = input;
  const all = new Map();
  const allChildren = new Map();
  const top: any[] = [];

  const addTop = (node) => {
    all.set(node.id, node);
    top.push(node.id);
    return node;
  };
  const addChild = (parentId: string, node) => {
    if (!all.has(node.id)) {
      all.set(node.id, node);
    }
    node.parentId = parentId;
    const bundle = (allChildren.has(parentId) ? allChildren : allChildren.set(parentId, [])).get(parentId);
    bundle.push(node.id);
  };

  function addVector(parentId: string, node: FNode) {
    const meta = components[node.componentId];
    const name = meta?.name ?? node.name ?? node.id;
    const componentName = toComponentName(`Svg`, name.replace(/^svg-?/i, ""));
    if (!all.has(componentName)) {
      const vnode = {
        ...node,
        id: componentName,
        type: "VECTOR",
        componentName,
      };
      addTop(vnode);
    }
    addUsageChild(parentId, node, componentName, {});
  }

  const addUsageChild = (parentId: string, node: FNode, componentName, attrs) => {
    addChild(parentId, {
      id: `U-${node.id}`,
      type: "USAGE",
      componentName,
      attrs,
      absoluteBoundingBox: node.absoluteBoundingBox,
      origin: node,
    });
  };

  const decomposeNode = (node: FNode, parent: FNode) => {
    const { id, type, children } = node;
    const parentId = parent.id;
    const layoutPositioning = parent?.layoutMode ? `AUTO-${parent.layoutMode}` : "ABSOLUTE";

    node.layoutPositioning = layoutPositioning;

    if (type === "COMPONENT_SET") {
      // local only, so will be added from its first variant instance, just like as remote
    } else if (node.name.startsWith("ignore-")) {
      // ignore
    } else if (type === "COMPONENT" || type === "INSTANCE" || node.name.startsWith("component-")) {
      const { componentId = id } = node;
      const meta = components[componentId] ?? { id, name: node.name.slice("component-".length) };
      let componentSetId = meta.componentSetId;
      if (!componentSetId) {
        // consider as a variant of a fake component for sake of brevity
        componentSetId = meta.componentSetId = `S:${componentId}`;
        componentSets[componentSetId] = { ...meta };
      }
      const { componentPropertyReferences, componentProperties = node.componentPropertyDefinitions } = node;
      const properties = adoptProperties({ ...componentProperties }, components);
      const attrs = properties.reduce((to, { id, value }) => {
        return Object.assign(to, { [id]: value })
      }, {});
      const compSetMeta = componentSets[componentSetId];
      const componentSetName = toComponentName(compSetMeta.name); //componentSetId

      if (componentPropertyReferences?.mainComponent) {
        // this is a reference to another component made from a parent property
        addUsageChild(parentId, { ...node, id: `D${id}` }, "DynamicComponent", {
          props: attrs,
          as: `{@${toPropertyName(componentPropertyReferences?.mainComponent)}}`,
        });
        return;
      }

      if (compSetMeta.name.toLowerCase().match(/^(icon|svg|logo)/i)) {
        addVector(parentId, node);
        return;
      }

      // create component set for first time
      const compSet =
        all.get(componentSetName) ??
        addTop({
          ...node,
          id: componentSetName,
          type: "COMPONENT_SET",
          name: `${compSetMeta.name}`,
          meta: { properties },
          componentName: componentSetName,
          caseKeys: {},
        });

      // create component variant for first time
      const when = selectorCaseKey(properties);
      if (!compSet.caseKeys[when]) {
        compSet.caseKeys[when] = 1;
        const vnode = { ...node, id, meta: { properties }, type: "VARIANT" };
        addChild(componentSetName, vnode);
        children?.forEach((v) => decomposeNode(v, node));
      }

      // add usage of this component in place
      addUsageChild(parentId, node, componentSetName, attrs);
    } else if (type === "VECTOR") {
      addVector(parentId, node);
    } else if (type === "TEXT") {
      const charRef = node.componentPropertyReferences?.["characters"];
      const text = charRef ? `@${toPropertyName(charRef)}` : node.characters;
      node.content = text;
      addChild(parentId, node);
      // } else if (node.name.startsWith("stub-")) {
      //   // skip inner content for stubs
      //   node.tag = 'stub'
      //   addChild(parentId, node);
    } else {
      // adjust html tags
      if (node.name.startsWith("html-")) {
        // node.tag = node.name.slice(5);
      }
      addChild(parentId, node);
      children?.forEach((v) => decomposeNode(v, node));
    }
  };

  // traverse and decompose all the tree
  document?.children.forEach(({ children }) =>
    children?.forEach(({ id, name, children, absoluteBoundingBox }) => {
      if (!name.toLowerCase().startsWith("page-")) return;

      const componentName = `${toComponentName(name)}`;
      const node = { id, name, type: "PAGE", componentName, absoluteBoundingBox, };
      addTop(node);
      children?.forEach((v) => decomposeNode(v, node));
    })
  );

  // apply normalization transformations
  const normNodes: Hash<NormalizedNode> = {};
  all.forEach((node: any) => {
    const { id, type, tag, attrs, content, meta, name, parentId, componentName, origin } = node;
    const parent = all.get(parentId);
    const bounds = getBounds(node.absoluteBoundingBox, (parent ?? node).absoluteBoundingBox);
    const styling = origin ? null : guardValuable(stylify(node, STYLE_DEFAULTS));
    const layout = Object.assign(stylify(origin ?? node, LAYOUT_DEFAULTS), {
      bounds,
    });

    normNodes[id] = dehydrateObject({ id, type, name, tag, attrs, meta, content, componentName, styling, layout, });
  });

  // re-union all
  all.forEach((node: any) => {
    const { id } = node;
    const nodes = allChildren.get(id)?.map((id) => normNodes[id]);
    if (nodes) {
      Object.assign(normNodes[id], { nodes });
    }
  });

  // select components (from top)
  const nodes = top.map((id) => normNodes[id]);

  const output = { nodes, styles, meta: metaInfo };

  return output;
}
