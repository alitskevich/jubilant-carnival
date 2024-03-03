export function parseNgService(input: string, opts) {
  // console.log(`✅ Parsing ${name}`);

  const END_POINT_URL_REQUEST = /url:\s+["']([^'"]+?)["'],\s+body:\s+\{([^}]+?)\},/gm;
  const output = [...input.matchAll(END_POINT_URL_REQUEST)].map((m) => {
    // console.log(`✅ `, m[1]);
    const id = m[1].replace("/adapters/DOFServices/", "");
    // const END_POINT_PARAMS_REQUEST = /([A-Z_]+)\(([^)]+?)\)\s*\{([\s\S]*?)return\s+\{\s+url:\s+'(.+?)',/gm
    // const output = [...input.matchAll(END_POINT_REQUEST)].map(m => {
    //   console.log(`✅ `, m[0]);
    //   return m
    // });
    const params =
      m[2]
        ?.split(/,\n?/gm)
        .map((s) => s.split(/:\s*/gm))
        .filter((s) => s[0] !== "")
        .map(([key, value]) => {
          return {
            key: key.trim(),
            binding: value?.trim().replace("this.", ""),
          };
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
