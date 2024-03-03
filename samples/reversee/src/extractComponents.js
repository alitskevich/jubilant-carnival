/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("node:fs");
const { eachFileInDir, readFileContent, transformFileContent } = require("../domreverse/src/utils.js");

const baseDir = path.join(__dirname, `../../prototype`);
const rootFile = "One440.jsx";

function createApplicator(string) {
  const keys = [];
  const expr = string
    .replace(/[.*+?^$()|[\]\\]/g, "\\$&")
    .replace(/\{@(\w+)(:?=([^}]+))?\}/g, (_, key, pattern = "\\S+") => {
      keys.push(key);
      return `(${pattern})`;
    })
    .replace(/[{}]/g, "\\$&")
    .replace(/\s+/g, "\\s+");

  console.log(expr);

  const regexp = new RegExp(expr, "gim");

  const applicator = (s, compId) => {
    const props = {};
    return s.replaceAll(regexp, (_, ...args) => {
      args.pop();
      args.pop();
      args.forEach((val, index) => {
        props[keys[index]] = val;
      });
      return `<${compId} ${Object.entries(props)
        .filter(([_, v]) => !!v)
        .map(([k, v]) => `${k}=${v?.[0] === "{" ? v : `"${v}"`}`)
        .join(" ")}/>`;
    });
  };
  return applicator;
}

const main = () => {
  const applicators = {};
  eachFileInDir(path.join(baseDir, "components"), (f) => {
    if (f === "index.ts") return;
    const content = readFileContent([baseDir, "components", f]);
    content.replace(/<component\s+id="(.+)">([\s\S]*?)<\/component>/gm, (_, tag, template) => {
      applicators[tag] = createApplicator(template.trim());
      return "";
    });
  });

  transformFileContent(path.join(baseDir, "src", rootFile), (input) => {
    const output = Object.entries(applicators).reduce((text, [compId, fn]) => fn(text, compId), input);
    console.log(output);
    return output;
  });

  const indexOut = Object.keys(applicators)
    .map((key) => `export * from "./${key}";`)
    .join("\n");

  console.log(indexOut);

  fs.writeFileSync(path.join(baseDir, "components", `index.ts`), indexOut);
};

main();
