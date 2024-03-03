export const pxCode = (n: number | string, defVal = "0"): string => {
  if (!n) return defVal;
  return `${n}px`;
};

