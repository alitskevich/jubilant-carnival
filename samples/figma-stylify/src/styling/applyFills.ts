import { FNode } from "../../types";
import { slug } from "../utils";
import { getTwColor } from "../utils/getTwColor";
export const tailwindGradient = (fill: any): string => {
  const stops = fill.gradientStops;
  const direction = `bg-gradient-to-${gradientDirection(fill.gradientHandlePositions)}`;
  const fromColor = getTwColor(stops[0].color) ?? 'transparent';

  if (fill.gradientStops.length === 1) {
    return `${direction} from-${fromColor} `;
  } else if (fill.gradientStops.length === 2) {
    const toColor = getTwColor(stops[1]?.color) ?? 'transparent';
    return `${direction} from-${fromColor} to-${toColor} `;
  } else {
    const viaColor = getTwColor(stops[1]?.color) ?? 'transparent';
    const toColor = getTwColor(stops[stops.length - 1].color);
    return `${direction} from-${fromColor} via-${viaColor} to-${toColor} `;
  }
};

const DIRECTION_CODES = {
  '0:1': 'b',
  '0:-1': 't',
  '1-0': 'r',
  '-1-0': 'l',

  '1:1': 'br',
  '-1:1': 'bl',
  '1:-1': 'tl',
  '-1:-1': 'tr',
}

const gradientDirection = (positions: number): string => {
  const dx = Math.round(positions[1].x) - Math.round(positions[0].x)
  const dy = Math.round(positions[1].y) - Math.round(positions[0].y)
  const dirX = dx > 0.1 ? dx / Math.abs(dx) : 0
  const dirY = dy > 0.1 ? dy / Math.abs(dy) : 0
  const direction = `${dirX}:${dirY}`
  return DIRECTION_CODES[direction] ?? 't'
};

export function applyFills({ addClass, type: nodeType }: FNode, { fills }) {
  fills?.forEach((fill: any) => {
    const { type, color } = fill;
    addClass(`fill-${slug(type)}`);
    if (type === "SOLID") {
      const classType = nodeType === "TEXT" ? "color" : "background-color";
      // const varId = boundVariables?.color?.id;
      // if (varId) {
      //   addClass(`${classType}-[{@@vars.${slug(varId)}}]`);
      // } else {
      const twc = getTwColor(color);
      addClass(`${classType}:${twc}`);
      // }
    } else if (type === "GRADIENT_LINEAR") {
      addClass(tailwindGradient(fill));
    }
  });
}
