import { readSubDirs, readFileContent } from "../files.js";

export function index({ context: { contentBase } }) {
  const list = readSubDirs(contentBase);
  return {
    projects: list.map((id) => ({
      id,
      ...JSON.parse(readFileContent([contentBase, id, "index.json"])),
    })),
  };
}
