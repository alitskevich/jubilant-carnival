import { readFileContent } from "./files.js";

export function project({ path, context: { contentBase, httpBase } }) {
  const root = JSON.parse(readFileContent([contentBase, ...path, "index.json"]));
  const enums = JSON.parse(readFileContent([contentBase, ...path, "enums.json"]));
  //AKfycby270ZB1dClxsslDg1Oc7QqGRjS6t7D39S2nrQbM7uk-haR2R-woxGtzhJWsiacFX8Oew
  return {
    ...root,
    enums,
    pages: root.pages.map((e) => ({
      ...e,
      url: `${httpBase}/previewPage/${e.id}`,
    })),
    id: path.join("/"),
  };
}
