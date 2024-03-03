// import { nearestOpacity, nearestValue } from "./scaleMaps";

import { Color } from "../../ast-types";

// ["fills", "strokes", "effects"].forEach((key) => {
//   styling[key]?.forEach((fill) => {
//     if (fill.color) {
//       const hex = rgbTo6hex(fill.color);
//       const hexNearestColor = tailwindNearestColor(hex);
//       fill.color = hexNearestColor;
//     }
//   });
//   delete styling[key]
// });

// export const tailwindSolidColor = (fill: SolidPaint, kind: string): string => {
//   // don't set text color when color is black (default) and opacity is 100%
//   if (
//     kind === "text" &&
//     fill.color.r === 0.0 &&
//     fill.color.g === 0.0 &&
//     fill.color.b === 0.0 &&
//     fill.opacity === 1.0
//   ) {
//     return "";
//   }

//   const opacity = fill.opacity ?? 1.0;

//   // example: text-opacity-50
//   // ignore the 100. If opacity was changed, let it be visible.
//   const opacityProp =
//     opacity !== 1.0 ? `${kind}-opacity-${nearestOpacity(opacity)} ` : "";

//   // example: text-red-500
//   const colorProp = `${kind}-${getTailwindFromFigmaRGB(fill.color)} `;

//   // if fill isn't visible, it shouldn't be painted.
//   return `${colorProp}${opacityProp}`;
// };



// Basic Tailwind Colors
export const tailwindColors: Record<string, string> = {
  "#000000": "black",
  "#ffffff": "white",

  "#fdf2f8": "pink-50",
  "#fce7f3": "pink-100",
  "#fbcfe8": "pink-200",
  "#f9a8d4": "pink-300",
  "#f472b6": "pink-400",
  "#ec4899": "pink-500",
  "#db2777": "pink-600",
  "#be185d": "pink-700",
  "#9d174d": "pink-800",
  "#831843": "pink-900",
  "#f5f3ff": "purple-50",
  "#ede9fe": "purple-100",
  "#ddd6fe": "purple-200",
  "#c4b5fd": "purple-300",
  "#a78bfa": "purple-400",
  "#8b5cf6": "purple-500",
  "#7c3aed": "purple-600",
  "#6d28d9": "purple-700",
  "#5b21b6": "purple-800",
  "#4c1d95": "purple-900",
  "#eef2ff": "indigo-50",
  "#e0e7ff": "indigo-100",
  "#c7d2fe": "indigo-200",
  "#a5b4fc": "indigo-300",
  "#818cf8": "indigo-400",
  "#6366f1": "indigo-500",
  "#4f46e5": "indigo-600",
  "#4338ca": "indigo-700",
  "#3730a3": "indigo-800",
  "#312e81": "indigo-900",
  "#eff6ff": "blue-50",
  "#dbeafe": "blue-100",
  "#bfdbfe": "blue-200",
  "#93c5fd": "blue-300",
  "#60a5fa": "blue-400",
  "#3b82f6": "blue-500",
  "#2563eb": "blue-600",
  "#1d4ed8": "blue-700",
  "#1e40af": "blue-800",
  "#1e3a8a": "blue-900",
  "#ecfdf5": "green-50",
  "#d1fae5": "green-100",
  "#a7f3d0": "green-200",
  "#6ee7b7": "green-300",
  "#34d399": "green-400",
  "#10b981": "green-500",
  "#059669": "green-600",
  "#047857": "green-700",
  "#065f46": "green-800",
  "#064e3b": "green-900",
  "#fffbeb": "yellow-50",
  "#fef3c7": "yellow-100",
  "#fde68a": "yellow-200",
  "#fcd34d": "yellow-300",
  "#fbbf24": "yellow-400",
  "#f59e0b": "yellow-500",
  "#d97706": "yellow-600",
  "#b45309": "yellow-700",
  "#92400e": "yellow-800",
  "#78350f": "yellow-900",
  "#fef2f2": "red-50",
  "#fee2e2": "red-100",
  "#fecaca": "red-200",
  "#fca5a5": "red-300",
  "#f87171": "red-400",
  "#ef4444": "red-500",
  "#dc2626": "red-600",
  "#b91c1c": "red-700",
  "#991b1b": "red-800",
  "#7f1d1d": "red-900",
  "#f9fafb": "gray-50",
  "#f3f4f6": "gray-100",
  "#e5e7eb": "gray-200",
  "#d1d5db": "gray-300",
  "#9ca3af": "gray-400",
  "#6b7280": "gray-500",
  "#4b5563": "gray-600",
  "#374151": "gray-700",
  "#1f2937": "gray-800",
  "#111827": "gray-900",
};

// from https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
export function calculateContrastRatio(color1: RGB, color2: RGB) {
  const color1luminance = luminance(color1);
  const color2luminance = luminance(color2);

  const contrast =
    color1luminance > color2luminance
      ? (color2luminance + 0.05) / (color1luminance + 0.05)
      : (color1luminance + 0.05) / (color2luminance + 0.05);

  return 1 / contrast;
}

function luminance(color: Color) {
  const a = [color.r * 255, color.g * 255, color.b * 255].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export const rgbTo6hex = (color: Color): string | undefined => {
  if (!color) return undefined;
  const hex =
    ((color.r * 255) | (1 << 8)).toString(16).slice(1) +
    ((color.g * 255) | (1 << 8)).toString(16).slice(1) +
    ((color.b * 255) | (1 << 8)).toString(16).slice(1);

  return hex;
};

export const rgbTo8hex = (color: Color, alpha: number): string => {
  // when color is RGBA, alpha is set automatically
  // when color is RGB, alpha need to be set manually (default: 1.0)
  const hex =
    ((alpha * 255) | (1 << 8)).toString(16).slice(1) +
    ((color.r * 255) | (1 << 8)).toString(16).slice(1) +
    ((color.g * 255) | (1 << 8)).toString(16).slice(1) +
    ((color.b * 255) | (1 << 8)).toString(16).slice(1);

  return hex;
};

// export const gradientAngle = (fill: GradientPaint): number => {
//   // Thanks Gleb and Liam for helping!
//   const decomposed = decomposeRelativeTransform(
//     fill.gradientTransform[0],
//     fill.gradientTransform[1]
//   );

//   return (decomposed.rotation * 180) / Math.PI;
// };
// from https://math.stackexchange.com/a/2888105
export const decomposeRelativeTransform = (
  t1: [number, number, number],
  t2: [number, number, number]
): {
  translation: [number, number];
  rotation: number;
  scale: [number, number];
  skew: [number, number];
} => {
  const a: number = t1[0];
  const b: number = t1[1];
  const c: number = t1[2];
  const d: number = t2[0];
  const e: number = t2[1];
  const f: number = t2[2];

  const delta = a * d - b * c;

  const result: {
    translation: [number, number];
    rotation: number;
    scale: [number, number];
    skew: [number, number];
  } = {
    translation: [e, f],
    rotation: 0,
    scale: [0, 0],
    skew: [0, 0],
  };

  // Apply the QR-like decomposition.
  if (a !== 0 || b !== 0) {
    const r = Math.sqrt(a * a + b * b);
    result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
    result.scale = [r, delta / r];
    result.skew = [Math.atan((a * c + b * d) / (r * r)), 0];
  }
  // these are not currently being used.
  // else if (c != 0 || d != 0) {
  //   const s = Math.sqrt(c * c + d * d);
  //   result.rotation =
  //     Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
  //   result.scale = [delta / s, s];
  //   result.skew = [0, Math.atan((a * c + b * d) / (s * s))];
  // } else {
  //   // a = b = c = d = 0
  // }

  return result;
};
/**
 * https://tailwindcss.com/docs/text-color/
 * example: text-blue-500
 * example: text-opacity-25
 * example: bg-blue-500
 */
// customColor(paint: ReadonlyArray<Paint> | any, kind: string): this {
//   // visible is true or undefinied (tests)
//   let gradient = "";
//   if (kind === "bg") {
//     gradient = tailwindGradientFromFills(paint);
//   }
//   if (gradient) {
//     this.attributes += gradient;
//   } else {
//     this.attributes += tailwindColorFromFills(paint, kind);
//   }
//   return this;
// }

// https://github.com/dtao/nearest-color converted to ESM and Typescript
// It was sligtly modified to support Typescript better.
// It was also slighly simplified because many parts weren't being used.

/**
 * Gets the nearest color, from the given list of {@link ColorSpec} objects
 * (which defaults to {@link nearestColor.DEFAULT_COLORS}).
 *
 * Probably you wouldn't call this method directly. Instead you'd get a custom
 * color matcher by calling {@link nearestColor.from}.
 *
 * @public
 * @param {RGB|string} needle Either an {@link RGB} color or a hex-based
 *     string representing one, e.g., '#FF0'
 * @param {Array.<ColorSpec>=} colors An optional list of available colors
 *     (defaults to {@link nearestColor.DEFAULT_COLORS})
 * @return {ColorMatch|string} If the colors in the provided list had names,
 *     then a {@link ColorMatch} object with the name and (hex) value of the
 *     nearest color from the list. Otherwise, simply the hex value.
 *
 * @example
 * nearestColor({ r: 200, g: 50, b: 50 }); // => '#f00'
 * nearestColor('#f11');                   // => '#f00'
 * nearestColor('#f88');                   // => '#f80'
 * nearestColor('#ffe');                   // => '#ff0'
 * nearestColor('#efe');                   // => '#ff0'
 * nearestColor('#abc');                   // => '#808'
 * nearestColor('red');                    // => '#f00'
 * nearestColor('foo');                    // => throws
 */
function nearestColor(needle: Color | string, colors: Array<ColorSpec>): string {
  needle = parseColor(needle);

  let distanceSq,
    minDistanceSq = Infinity,
    rgb;
  let value: ColorSpec | undefined = undefined;

  for (let i = 0; i < colors.length; ++i) {
    rgb = colors[i].rgb;

    distanceSq = Math.pow(needle.r - rgb.r, 2) + Math.pow(needle.g - rgb.g, 2) + Math.pow(needle.b - rgb.b, 2);

    if (distanceSq < minDistanceSq) {
      minDistanceSq = distanceSq;
      value = colors[i];
    }
  }

  return value?.source ?? "";
}

/**
 * Given either an array or object of colors, returns an array of
 * {@link ColorSpec} objects (with {@link RGB} values).
 *
 * @private
 * @param {Array.<string>|Object} colors An array of hex-based color strings, or
 *     an object mapping color *names* to hex values.
 * @return {Array.<ColorSpec>} An array of {@link ColorSpec} objects
 *     representing the same colors passed in.
 */
function mapColors(colors: Array<string>): Array<ColorSpec> {
  return colors.map((color) => createColorSpec(color));
}

/**
 * Provides a matcher to find the nearest color based on the provided list of
 * available colors.
 *
 * @public
 * @param {Array.<string>|Object} availableColors An array of hex-based color
 *     strings, or an object mapping color *names* to hex values.
 * @return {function(string):ColorMatch|string} A function with the same
 *     behavior as {@link nearestColor}, but with the list of colors
 *     predefined.
 *
 * @example
 * var colors = {
 *   'maroon': '#800',
 *   'light yellow': { r: 255, g: 255, b: 51 },
 *   'pale blue': '#def',
 *   'white': 'fff'
 * };
 *
 * var bgColors = [
 *   '#eee',
 *   '#444'
 * ];
 *
 * var invalidColors = {
 *   'invalid': 'foo'
 * };
 *
 * var getColor = nearestColor.from(colors);
 * var getBGColor = getColor.from(bgColors);
 * var getAnyColor = nearestColor.from(colors).or(bgColors);
 *
 * getColor('ffe');
 * // => { name: 'white', value: 'fff', rgb: { r: 255, g: 255, b: 255 }, distance: 17}
 *
 * getColor('#f00');
 * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
 *
 * getColor('#ff0');
 * // => { name: 'light yellow', value: '#ffff33', rgb: { r: 255, g: 255, b: 51 }, distance: 51}
 *
 * getBGColor('#fff'); // => '#eee'
 * getBGColor('#000'); // => '#444'
 *
 * getAnyColor('#f00');
 * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
 *
 * getAnyColor('#888'); // => '#444'
 *
 * nearestColor.from(invalidColors); // => throws
 */
export const nearestColorFrom = (availableColors: Array<string>): ((hex: string | RGB) => string) => {
  const colors = mapColors(availableColors);
  return (hex: string | RGB) => nearestColor(hex, colors);
};

/**
 * Parses a color from a string.
 *
 * @private
 * @param {RGB|string} source
 * @return {RGB}
 *
 * @example
 * parseColor({ r: 3, g: 22, b: 111 }); // => { r: 3, g: 22, b: 111 }
 * parseColor('#f00');                  // => { r: 255, g: 0, b: 0 }
 * parseColor('#04fbc8');               // => { r: 4, g: 251, b: 200 }
 * parseColor('#FF0');                  // => { r: 255, g: 255, b: 0 }
 * parseColor('rgb(3, 10, 100)');       // => { r: 3, g: 10, b: 100 }
 * parseColor('rgb(50%, 0%, 50%)');     // => { r: 128, g: 0, b: 128 }
 * parseColor('aqua');                  // => { r: 0, g: 255, b: 255 }
 * parseColor('fff');                   // => { r: 255, g: 255, b: 255 }
 * parseColor('foo');                   // => throws
 */
function parseColor(source: RGB | string): RGB {
  let red, green, blue;

  if (typeof source === "object") {
    return source;
  }

  let hexMatchArr = source.match(/^#?((?:[0-9a-f]{3}){1,2})$/i);
  if (hexMatchArr) {
    const hexMatch = hexMatchArr[1];

    if (hexMatch.length === 3) {
      hexMatchArr = [
        hexMatch.charAt(0) + hexMatch.charAt(0),
        hexMatch.charAt(1) + hexMatch.charAt(1),
        hexMatch.charAt(2) + hexMatch.charAt(2),
      ];
    } else {
      hexMatchArr = [hexMatch.substring(0, 2), hexMatch.substring(2, 4), hexMatch.substring(4, 6)];
    }

    red = parseInt(hexMatchArr[0], 16);
    green = parseInt(hexMatchArr[1], 16);
    blue = parseInt(hexMatchArr[2], 16);

    return { r: red, g: green, b: blue };
  }

  throw Error(`"${source}" is not a valid color`);
}

type RGB = {
  r: number;
  g: number;
  b: number;
};

export type ColorMatch = {
  name: string;
  value: string;
  rgb: RGB;
  distance: number;
};

type ColorSpec = {
  source: string;
  rgb: RGB;
};

//   export function createColorSpec(input: string | RGB, name: string): ColorSpec;

//   // it can actually return a ColorMatch, but let's ignore that for simplicity
//   // in this app, it is never going to return ColorMatch because the input is hex instead of red
//   export function from(
//     availableColors: Array<String> | Object
//   ): (attr: string) => string;

/**
 * Creates a {@link ColorSpec} from either a string or an {@link RGB}.
 *
 * @private
 * @param {string|RGB} input
 * @param {string=} name
 * @return {ColorSpec}
 *
 * @example
 * createColorSpec('#800'); // => {
 *   source: '#800',
 *   rgb: { r: 136, g: 0, b: 0 }
 * }
 *
 * createColorSpec('#800', 'maroon'); // => {
 *   name: 'maroon',
 *   source: '#800',
 *   rgb: { r: 136, g: 0, b: 0 }
 * }
 */
function createColorSpec(input: string): ColorSpec {
  return {
    source: input,
    rgb: parseColor(input),
  };
}

export const tailwindNearestColor = nearestColorFrom(Object.keys(tailwindColors));
