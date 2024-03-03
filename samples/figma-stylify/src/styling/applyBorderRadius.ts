import { CORNER_KEYS, borderRadiusKey } from "../utils/scaleMaps";
import { ANode } from "../nodes/ANode";

/**
 * https://tailwindcss.com/docs/border-radius/
 * example: rounded-sm
 * example: rounded-tr-lg
 */
export const applyBorderRadius = (
  { addClass, layout: { bounds } = {} }: ANode,
  { cornerRadius, rectangleCornerRadii }
) => {
  if (cornerRadius) {
    if (bounds?.h && cornerRadius >= bounds?.h / 2) {
      // special case. If height is 90 and cornerRadius is 45, it is full.
      addClass("rounded-full");
    } else {
      addClass(`rounded-${borderRadiusKey(cornerRadius)}`);
    }
  }
  if (rectangleCornerRadii) {
    // todo optimize for tr/tl/br/bl instead of t/r/l/b
    // const [tl = 0, tr = 0, bl = 0, br = 0] = rectangleCornerRadii;
    CORNER_KEYS.forEach((key, index) => {
      const px = rectangleCornerRadii[index];
      if (px) {
        addClass(`rounded-${key}-${borderRadiusKey(px)}`);
      }
    });
  }
};
