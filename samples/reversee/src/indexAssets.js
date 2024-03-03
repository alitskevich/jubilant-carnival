import config from "./config";
import { mapFilesInDirectory, writeFileContent } from "ultimus-fs";

const { baseDir } = config;

const main = (dir) => {
  const output = mapFilesInDirectory(
    dir,
    (key) => `export {default as ${key.split(".")[0].replaceAll("-", "_")} } from "./${key}";`
  ).join("\n");

  writeFileContent([dir, `index.ts`], output);
};

main([baseDir, "public"]);
