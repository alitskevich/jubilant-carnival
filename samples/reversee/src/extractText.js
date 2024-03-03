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
    const output = input.replaceAll(
      /<div\s+className="([^"]+)"\s+font={([^"]+)}\s*>\s*([^<]+)<\/div>/gm,
      (_, cl, font, val) => {
        val = val.trim();
        let key = collectors[val];
        if (!key) {
          key = val.toLowerCase().replace(/\s+/g, "_").replace(/[\W]/g, "");
          collectors[val] = key;
        }

        return `<Text text={T("@Strings.${key}")} className="${cl}" font={${font}} />`;
      }
    );
    console.log(output);
    return output;
  });

  fs.writeFileSync(
    path.join(__dirname, `../../prototype/Strings.ts`),
    `export const Strings = {\n${Object.entries(collectors)
      .map(([val, key]) => ` "${key}": "${val}",`)
      .join("\n")}\n}`
  );
};
main();
