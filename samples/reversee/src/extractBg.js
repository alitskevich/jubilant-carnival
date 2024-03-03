/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("node:fs");
const { transformFileContent } = require("./utils.js");

const rootFile = "One440.jsx";
const srcDir = path.join(__dirname, `../../prototype/src`);
let NEXT = 1;

const main = () => {
  const collectors = {};

  transformFileContent(path.join(srcDir, rootFile), (input) => {
    const output = input.replaceAll(/background:\s+"([^"]+)"/gm, (_, val) => {
      let key = collectors[val];
      if (!key) {
        key = `BG${NEXT++}`;
        collectors[val] = key;
      }

      return `background: Backgrounds.${key}`;
    });
    console.log(output);
    return output;
  });

  fs.writeFileSync(
    path.join(__dirname, `../../prototype/Backgrounds.ts`),
    Object.entries(collectors)
      .map(([val, key]) => `export const ${key} = "${val}";`)
      .join("\n")
  );
};

main();
