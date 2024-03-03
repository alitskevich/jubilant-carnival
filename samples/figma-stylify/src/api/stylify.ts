import { FNode } from "../../types";
import { guardValuable, toPropertyName } from "../utils";
import { Hash, isValuable, mapEntries } from "ultimus";
import { getPaddingInfo } from "../utils/getPaddingInfo";
import { getTwColor } from "../utils/getTwColor";
import { rgbTo6hex } from "../utils/color";

export const TEXT_DEFAULTS = {
  textAutoResize: null,
  textAlignHorizontal: null,
  textAlignVertical: null,

  fontFamily: null,
  fontPostScriptName: null,
  fontWeight: null,
  fontSize: null,

  lineHeightPx: null,
  letterSpacing: null,

  textCase: null,
  textDecoration: null,

  hyperlink: null,
};

export const STYLE_DEFAULTS = {
  blendMode: "PASS_THROUGH",
  strokeAlign: "INSIDE",
  strokeWeight: null,
  effects: null,
  strokes: (list) => list?.map((e) => ({ ...e, color: rgbTo6hex(e.color) })),
  fills: (list) => list?.map((e) => ({ ...e, color: rgbTo6hex(e.color) })),
  cornerRadius: null,
  rectangleCornerRadii: null,
  padding: (_, origin) => getPaddingInfo(origin),
  textStyle: (_, origin) => guardValuable(stylify(origin.style, TEXT_DEFAULTS, origin)),
  backgroundColor: (backgroundColor) => {
    if (backgroundColor) {
      const twc = getTwColor(backgroundColor);
      if (twc !== "black") return twc;
    }
  },

  layoutMode: null,
  layoutWrap: null,
  itemSpacing: null,
  primaryAxisAlignItems: null,
  counterAxisAlignItems: null,
  primaryAxisSizingMode: null,
  counterAxisSizingMode: null,
};

export const LAYOUT_DEFAULTS = {
  if: (_, { visible, componentPropertyReferences: refs }) => {
    if (refs?.visible) {
      return `@${toPropertyName(refs.visible)}`;
    } else if (visible === false) {
      return false;
    }
  },
  layoutPositioning: (val) => val,
  constraints: ({ vertical, horizontal }: any = {}) =>
    vertical === "TOP" && horizontal === "LEFT" ? undefined : { vertical, horizontal },
  minWidth: null,
  maxWidth: null,
  isFixed: null,

  layoutAlign: "INHERIT",
  layoutGrow: 0,
  layoutVersion: 4,
  clipsContent: false,
};

export const stylify = (data: FNode, meta: any, origin = data) => {
  if (!data) return {};

  const bundle: Hash = {};

  mapEntries(meta, (key, value) => {
    let val = data[key];
    if (typeof value === "function") {
      val = value(val, origin);
    }
    if (val != null && val !== value && isValuable(val)) {
      bundle[key] = val;
    }
  });

  return bundle;
};
