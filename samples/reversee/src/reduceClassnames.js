/* eslint-disable @typescript-eslint/no-var-requires */
const { transformFileContent } = require("./utils.js");

const rootFile = "One440.jsx";
const srcDir = [__dirname, `../../prototype/src`];

const CLASSES = {
  "flex-line": "flex flex-row items-start justify-start shrink-0 relative",
  "flex-center-line": "flex flex-row items-center justify-start shrink-0 relative",
  "flex-centroid": "flex flex-row items-center justify-center shrink-0 relative",
  "flex-stack": "flex flex-col items-start justify-start shrink-0 relative",
};

const main = () => {
  const applicators = Object.entries(CLASSES).map(function ([key, val]) {
    const tokens = val.split(" ");

    return (input) => {
      const chunks = input.split(" ");
      const matched = !tokens.find((t) => !chunks.includes(t));
      if (!matched) return input;

      const output = `${key} ${tokens.reduce((r, t) => r.replaceAll(` ${t} `, " "), ` ${input} `).trim()}`.trim();
      console.log(output);
      return output;
    };
  });

  transformFileContent([...srcDir, rootFile], (input) => {
    const output = input.replaceAll(/className="(.+)"/gm, (_, cl) => {
      return `className="${applicators.reduce((r, fn) => fn(r), cl)}"`;
    });
    console.log(output);
    return output;
  });

  const styles = Object.entries(CLASSES)
    .map(
      ([key, val]) => `
.${key} {
  @apply ${val};
}
  `
    )
    .join("");

  console.log(styles);
};

main();
