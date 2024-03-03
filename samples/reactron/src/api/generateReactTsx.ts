import { mapEntries, qname, scalarParse } from "ultimus";
import { toReactComponentClassName } from "../utils";
const pairedTags = ["component", "div", "section", "svg"];

const PROP_TYPES = {
  INSTANCE_SWAP: "string",
  VARIANT: "string",
  TEXT: "string",
};

export const generateReactTsx = (body: any = [], componentClassName: string, metadata: any = {}, ctx: any) => {
  const { partialContent = false, indent = "", styling } = ctx ?? {};
  const { description } = metadata;
  const codeBlock: string[] = [];
  const imports = {};
  const props = metadata.properties ?? (metadata.properties = {});
  const cases = metadata.cases ?? (metadata.cases = {});
  const dependencies = metadata.dependencies ?? (metadata.dependencies = []);

  const registerProp2 = (x: string, opts = {}) => {
    const id = qname(x === "class" ? "className" : x);
    if (!props[id]) {
      props[id] = opts;
    }
    return id;
  };
  const registerImport = (x: string, from = "") => {
    const id = toReactComponentClassName(x);
    if (!imports[id]) {
      imports[id] = from || `../${id}`;
    }
    if (!from && !dependencies.includes(id)) {
      dependencies.push(id);
    }
    return id;
  };

  const resolveBoundPropName = (val: string) => {
    let bindPropName = val.slice(1);

    if (bindPropName.startsWith("@")) {
      registerImport("T", "@/i18n");
      return `T("${bindPropName.slice(1)}")`;
    }

    if (bindPropName.endsWith("#not")) {
      bindPropName = `!${bindPropName.slice(0, bindPropName.length - 4)}`;
    }
    return `${bindPropName}`;
  };

  const resolveAttributeValue = (val: string) => {
    if (typeof val === "string") {
      if (val.startsWith("@")) {
        return resolveBoundPropName(val);
      }

      if (val.includes("{")) {
        const substVar = (val: string) => {
          if (val.startsWith("@")) {
            return resolveBoundPropName(val);
          }
          return JSON.stringify(scalarParse(val));
        };
        const substExpr = (_: string, expr: string) => {
          return `\${${expr.replaceAll(/@?@?[\w\.-]+/g, substVar)}}`;
        };
        return `\`${val.replaceAll(/{([^}]+)}/g, substExpr)}\``;
      }
    }

    return JSON.stringify(scalarParse(val));
  };

  const attributesToString = (attrs: any, sep = " ") =>
    mapEntries(attrs, (key, value) => {
      if (key === "key") {
        return ``;
      }
      if (key === "class") {
        if (!value) return "";
        const qKey = `s${qname(attrs.key)}`;
        if (value.includes("{@class}")) {
          registerProp2("className", { type: "string" });
          styling[qKey] = value.replace("{@class}", "");
          return `className={\`\${C.${qKey}} \${className}\`}`;
        }
        styling[qKey] = value;
        return `className={C.${qKey}}`;
      }
      return `${key}={${resolveAttributeValue(value)}}`;
    }).join(sep);

  const outChildNodes = (output, nodes, indent) => {
    nodes.forEach((child: any) => {
      output.push(nodeToJsx(child.getHtmlNode ? child.getHtmlNode() : child, indent));
    });
  };

  function nodeToJsx(inode: any, indent = "    ") {
    let { tag = "div" } = inode;
    const { attrs = {}, nodes: xnodes } = inode;
    const nodes = xnodes ? (Array.isArray(xnodes) ? xnodes : [xnodes]) : null;
    const hasChildren = nodes?.length;
    const singleTag = !hasChildren && !pairedTags.includes(tag);
    const output: string[] = [];

    if (attrs?.hidden) {
      const hidden = attrs.hidden;
      const expr = hidden.startsWith?.("@") ? resolveBoundPropName(hidden) : hidden;
      delete attrs.hidden;
      return `${indent}{${expr} ?  null : ${nodeToJsx(inode, indent)}}`;
    }

    if (tag[0] === tag[0].toUpperCase()) {
      if (tag === "Selector") {
        // codeBlock.push(`const selectorKey = ${resolveAttributeValue(attrs.key)};`)
        outChildNodes(output, nodes, `${indent}  `);
        return output.join("\n");
      } else if (tag === "Meta") {
        nodes
          ?.find((n) => n.tag == "Properties")
          ?.nodes?.filter((n) => n.tag == "Property")
          .forEach(({ attrs: { id, type } }) => {
            // console.log(id, type)

            registerProp2(id, {
              type: PROP_TYPES[type] ?? type?.toLowerCase() ?? "string",
            });
          });
        // codeBlock.push(`const selectorKey = ${resolveAttributeValue(attrs.key)};`)
        return "";
      } else if (tag === "Case") {
        const keys: any = {};
        const formula: string[] = [];
        let id = "Default";
        attrs.when
          .split(",")
          .map((k) => k.trim().split("="))
          .forEach(([key, val]) => {
            if (key === "key") {
              id = val;
            } else {
              keys[key] = val;
              // registerProp(key)
              formula.push(`String(${key}) === "${val}"`);
            }
          });
        if (formula.length == 0) {
          // registerProp('key')
          formula.push(`key === "${id}"`);
        }
        cases[id] = keys;
        output.push(`${indent}{ !(${formula.join(" && ")}) ? null : `);
        outChildNodes(output, nodes, `${indent}  `);
        output.push(`${indent}}`);
        return output.join("\n");
      } else if (tag === "Text") {
        output.push(`${indent}<${tag} ${attributesToString({ ...attrs }, `\n${indent}  `)} />`);
        registerImport(tag, "@/atoms");
        return output.join("\n");
      } else if (tag === "DynamicComponent") {
        output.push(`${indent}<${tag} ${attributesToString({ ...attrs }, `\n${indent}  `)} />`);
        registerImport(tag, "@/atoms");
        return output.join("\n");
      } else if (tag.startsWith("Svg")) {
        tag = registerImport(tag, "@/svg");
        output.push(`${indent}<${tag} ${attributesToString({ ...attrs }, `\n${indent}  `)} />`);
        return output.join("\n");
      }
      tag = registerImport(tag);
    }

    output.push(`${indent}<${tag} ${attributesToString({ ...attrs }, `\n${indent}  `)}${singleTag ? " /" : ""}>`);
    if (hasChildren) {
      outChildNodes(output, nodes, `${indent}  `);
    }
    if (!singleTag) {
      output.push(`${indent}</${tag}>`);
    }

    return output.join("\n");
  }

  const jsx = body.map((n) => nodeToJsx(n, indent)).join("\n  ");

  const propType = `{\n${mapEntries(
    props,
    (id, p: any) => `  ${id}${p.required ? "" : "?"}: ${p.type ?? "string"}; // ${p.description ?? id}`
  ).join("\n")}\n}`;
  const importedComponents = mapEntries(imports, (id, from) => `import { ${id} } from "${from}";`).join("\n");
  const propNames = mapEntries(props, (id: any) => `${id}`).join(", ");
  const hasProps = !!propNames.length;
  const propsTypes = hasProps ? propType : "Record<string, never>";

  /**
   * Partial output.
   */
  const partial = `//auto-start
// CAUTION: code between 'auto-start' and 'auto-end' may be automatically rewritten by plugin

// Component properties type
type ${componentClassName}Props = ${propsTypes};

/**
 * ${componentClassName} UI Component.
 * ${description}
 * 
 * @copyright ADGOV, 2023
 */
//auto-end`;

  if (partialContent) return partial;

  /**
   * Full output.
   */
  const output = `/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-constant-condition */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import React, { FC } from "react";
import { C } from "./${componentClassName}.styles";

${importedComponents}

${partial}
export const ${componentClassName}: FC<${componentClassName}Props> = (${propNames ? `{${propNames}}` : ""}) => {
  ${codeBlock.join(",  ")}
  return (
  <>
${jsx}
  </>
  );
}`;

  return output;
};
