import { snakeCase } from "ultimus";
import { skipQoutes } from "ultimus/src/xml/utils";

export function parseInterfaces(input: string, opts = {}) {
  // console.log(`✅ Parsing ${name}`);

  const RE_INTERFACE = /export interface ([\w]+)\s*\{([^}]+?)\}/gm;
  const output = [...input.matchAll(RE_INTERFACE)].map((m) => {
    // console.log(`✅ `, m[1]);
    const id = snakeCase(m[1]);

    const params =
      m[2]
        ?.split(/,?:?\n/gm)
        .map((s) => s.split(/:\s*/gm))
        .filter((s) => s[0] !== "")
        .map(([x, value]) => {
          let key = skipQoutes(x.trim());
          let required: boolean | undefined = true;
          let multi: boolean | undefined = undefined;
          let typeSpec: any = undefined;

          if (key?.endsWith("?")) {
            key = key.slice(0, -1);
            required = undefined;
          }
          if (value?.endsWith("[]")) {
            value = value.slice(0, -2);
            multi = true;
          }
          if (value?.[0].match(/[A-Z]/) && !value.includes("String")) {
            typeSpec = snakeCase(value);
            value = "struct";
          }

          return { key, required, multi, type: value, typeSpec };
        }) ?? [];
    return {
      ...opts,
      id,
      params,
    };
  });
  console.log(`✅ Parsed`, output);
  return output;
}
