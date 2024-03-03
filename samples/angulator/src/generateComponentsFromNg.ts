import { XmlNode, mapEntries, xmlStringify, arrayToObject, properCase, capitalize } from "ultimus";
import { skipQoutes } from "ultimus/src/xml/utils";

const TAGS = {
  Div: "div",
};

// function valueExpression(value: any) {
//   throw String(value);//.replaceAll(/123/g, '1');//.replaceAll("'@", "'");
// }

const translateTag = (tag) => {
  if (["div", "p", "span", "b", "br"].includes(tag)) return tag;

  const chunks = tag.split("-").map(properCase);

  if (chunks[0] === "Ng" || chunks[0] === "Ion") {
    chunks.shift();
  }

  const proper = chunks.join(".");

  if (TAGS[proper]) {
    return TAGS[proper];
  }
  return proper;
};

const translateValue = (val) => {
  return String(val).replaceAll(/\{\{([\s\S]+?)\}\}/gm, (_, expr) => {
    return `{js:${expr}}`;
  });
};
const translateAttrKey = (x) => {
  return String(x)
    .split("-")
    .map((t, i) => (i ? capitalize(t) : t))
    .join("");
};

const translateAttr = (key: string, value: any) => {
  if (key === "*ngFor") {
    return { key: "each", value: value.replace("let ", "") };
  }
  if (key === "*ngIf") {
    return { key: "if", value: `js:${value}` };
  }
  if (key === "[(ngModel)]") {
    return { key: "model", value: `${value}` };
  }
  if (key[0] === "[") {
    return {
      key: translateAttrKey(skipQoutes(key, "[", "]")),
      value: `js:${value}`,
    };
  }
  if (key[0] === "#") {
    return { key: "if", value: `@${key.slice(1)} == '${value}'` };
  }
  if (key[0] === "(") {
    return {
      key: translateAttrKey(skipQoutes(key, "(", ")")),
      value: `-> ctrl.${value}`,
    };
  }
  return { key: translateAttrKey(key), value: translateValue(value) };
};

const translateNode = ({ tag, attrs, text, nodes }: XmlNode) => {
  const tAattrs = arrayToObject(
    mapEntries(attrs, (key, val) => translateAttr(key, val)),
    "key",
    "value"
  );
  // console.log(tAattrs)
  return {
    tag: translateTag(tag),
    text,
    attrs: tAattrs,
    nodes: nodes?.map(translateNode).filter(Boolean),
  };
};

export function generateComponentsFromNg(input: XmlNode[], componentId): string {
  const translated = input.map(translateNode);

  return xmlStringify({
    tag: "component",
    attrs: { id: componentId },
    nodes: translated,
  });
}
