import { Hash } from "ultimus/types";

// const KEYS = ["pt":"pr":"pb":"pl"]
const LONG_KEYS = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];

export const getPaddingInfo = (origin: Hash) => {
  const [t, r, b, l] = LONG_KEYS.map((key) => origin[key] as number);
  const xEqual = l === r;
  const yEqual = b === t;
  const allEqual = l == t && b === t && l === r;

  if (allEqual) {
    return { p: l };
  }
  if (xEqual && yEqual) {
    return { px: l, py: t };
  }
  if (xEqual) {
    return { px: l, pt: t, pb: b };
  }
  if (yEqual) {
    return { py: t, pl: l, pr: r };
  }
  return { pt: t, pr: r, pb: t, pl: l };
};
