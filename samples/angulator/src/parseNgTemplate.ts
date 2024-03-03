import { xmlParserFactory } from "ultimus/src/xml/xmlParserFactory";

const RE_ATTRS = /([a-z\(\*\[\#][a-zA-Z0-9-_:\.\(\[\)\*\])]*)(="[^"]*"|="[^"]*"|='[^']*'|=[^\s>]*)?/gm;
const RE_EMPTY = /^\s*$/;
const RE_XML_COMMENT = /<!--((?!-->)[\s\S])*-->/g;
const RE_XML_TAG =
  /(<)(\/?)([a-z][a-z0-9\-\_:.]*)((?:\s+[a-z\(\*\[\#][a-z0-9-_s:\.\(\[\)\*\]]*(?:="[^"]*"|="[^"]*"|='[^']*'|=[^\s>]*)?)*)\s*(\/?)>/gim;

const SINGLE_TAGS = { img: 1, input: 1, br: 1, hr: 1, col: 1, source: 1 };

/**
 * Parses a NG template string and returns an array of XmlNode objects.
 *
 * @param {_s} [string] The XML string to be parsed.
 * @returns {XmlNode[]} An array of XmlNode objects representing the XML nodes in the parsed string.
 */
export const ngParse = xmlParserFactory({
  RE_XML_TAG,
  RE_EMPTY,
  RE_XML_COMMENT,
  RE_ATTRS,
  SINGLE_TAGS,
});

export function parseNgTemplate(input) {
  return ngParse(input);
}
