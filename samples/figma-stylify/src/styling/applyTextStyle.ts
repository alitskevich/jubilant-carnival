import { getTwColor } from "../utils/getTwColor";
import {
  resolveFontWeightClass,
  resolvePrecisePixelsScaleClass,
} from "../utils/scaleMaps";
import { textAlignHorizontalMap, textAlignVerticalMap, textCaseMap, textDecorationMap } from "./classMaps";

export const commonLineHeight = (node: any): number => {
  if (node.lineHeight && node.lineHeight.unit !== "AUTO" && Math.round(node.lineHeight.value) !== 0) {
    if (node.lineHeight.unit === "PIXELS") {
      return node.lineHeight.value;
    } else {
      if (node.fontSize) {
        // based on tests, using Inter font with varied sizes and weights, this works.
        // example: 24 * 20 / 100 = 4.8px, which is correct visually.
        return (node.fontSize * node.lineHeight.value) / 100;
      }
    }
  }

  return 0;
};

export const commonLetterSpacing = (node: any): number => {
  if (node.letterSpacing && Math.round(node.letterSpacing.value) !== 0) {
    if (node.letterSpacing.unit === "PIXELS") {
      return node.letterSpacing.value;
    } else {
      if (node.fontSize) {
        // read [commonLineHeight] comment to understand what is going on here.
        return (node.fontSize * node.letterSpacing.value) / 100;
      }
    }
  }

  return 0;
};

export function applyTextStyle({ textStyle, fills }: any, addClass) {
  if (textStyle) {
    const {
      fontFamily = "Inter",
      // fontPostScriptName,
      fontWeight,
      fontSize,
      // textAutoResize,
      textAlignHorizontal,
      textAlignVertical,
      letterSpacing,
      lineHeightPx,
      textCase,
      textDecoration,
      // hyperlink,
    } = textStyle;

    if (fontFamily) {
      addClass(fontFamily === "Inter" ? 'font-sans' : `font-['${fontFamily}']`);
    }

    fills?.forEach(({ type, color }) => {
      if (type === "SOLID") {
        const twc = getTwColor(color);
        addClass(`text-${twc}`);
      }
    });

    addClass(resolveFontWeightClass(fontWeight));
    addClass(resolvePrecisePixelsScaleClass("text", fontSize));
    addClass(resolvePrecisePixelsScaleClass("leading", lineHeightPx));
    addClass(resolvePrecisePixelsScaleClass("tracking", letterSpacing));

    addClass(textCaseMap[textCase]);
    addClass(textAlignHorizontalMap[textAlignHorizontal]);
    addClass(textAlignVerticalMap[textAlignVertical]);
    addClass(textDecorationMap[textDecoration]);
  }
}
