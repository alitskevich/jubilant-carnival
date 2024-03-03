import { readFileContent } from "./files.js";

export function markup({ path, contentBase }) {
  const RE = /<include src="([^"]+)"\s*\/>/g;
  const dirs = path.slice(0, -1);
  const substFn = (_, e) => readFileContent([contentBase, ...dirs, e]);
  const markup = readFileContent([contentBase, ...path]).replace(RE, substFn);
  return markup;
}
