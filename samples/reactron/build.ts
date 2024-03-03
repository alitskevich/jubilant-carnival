import {
  fileExists,
  readFileContent,
  readFileJsonContent,
  transformFileJsonContent,
  writeFileContent,
  writeFileJsonContent,
} from "ultimus-fs";
import { mapEntries } from "ultimus";
import { toReactComponentClassName } from "figma-tailwind";
import { config } from "./src/config";
import * as prettier from "prettier";
import { generateReactTsx } from "./src/api/generateReactTsx";
import { generateReactStory } from "./src/api/generateReactStory";
import { generateReactSvg } from "./src/api/generateReactSvg";
import { xmlParserFactory } from "ultimus/src/xml/xmlParserFactory";

const { outputDir = "output", inputDir = "input" } = config;

const prettiesOptions = {
  parser: "babel",
  singleQuote: false,
  tabWidth: 2,
  printWidth: 120,
  semi: true,
  singleAttributePerLine: false,
  trailingComma: "es5",
};

const prettify = (content) => {
  try {
    return prettier.format(content, prettiesOptions);
  } catch {
    return content;
  }
};
const xmlParse = xmlParserFactory({
  SINGLE_TAGS: { img: 1, br: 1, hr: 1, col: 1, source: 1 },
});

const writeStory = (filePath, componentClassName, meta) => {
  if (!fileExists(filePath)) {
    const story = generateReactStory(componentClassName, meta);
    writeFileContent(filePath, prettify(story));
  }
};

export async function doGenerateSvg() {
  const input = readFileContent([inputDir, `svg.xml`]);
  const nodes: any = xmlParse(`${input}`)[0].nodes;

  const componentNames = nodes
    .filter((n) => n.attrs?.id)
    .map((n) => {
      const { attrs } = n;
      const componentName = attrs?.id;
      const componentClassName = toReactComponentClassName(componentName);
      const content = generateReactSvg(componentClassName);
      const filePath = [outputDir, "svg", `${componentClassName}.tsx`];
      if (!fileExists(filePath)) {
        writeFileContent(filePath, prettify(content));
      }
      return { id: componentClassName };
    });

  writeFileContent([outputDir, "svg", `index.ts`], componentNames?.map((n) => `export * from "./${n.id}";`).join("\n"));
  console.log("✅ Generated SVG.");
}

export async function doGenereact() {
  const input = readFileContent([inputDir, `components.xml`]);
  const inputPages = readFileContent([inputDir, `pages.xml`]);
  const figma = readFileJsonContent([inputDir, `meta.json`]);

  const allStylings = {};
  const nodes: any = [...(xmlParse(input)[0].nodes ?? []), ...(xmlParse(inputPages)[0].nodes ?? [])];
  // console.log(nodes)

  const componentNames =
    nodes
      .filter((n) => n.attrs.id)
      .map((n) => {
        const { attrs, nodes } = n;
        const componentName = attrs?.id;
        if (componentName) {
          const componentClassName = toReactComponentClassName(componentName);
          const withPathBase = (file) => [outputDir, "snippets", componentClassName, file];
          const metaDefault = {
            id: componentClassName,
            group: `design`,
            title: `${componentClassName}`,
            labels: ["auto", "atomic", "react"],
            description: `${componentClassName}`,
          };
          const meta = readFileJsonContent(withPathBase(`${componentClassName}.meta.json`), metaDefault);
          const previousContent = readFileContent(withPathBase(`${componentClassName}.tsx`));

          const ctx = {
            indent: "    ",
            partialContent: !!previousContent,
            styling: {},
          };
          const content = generateReactTsx(nodes, componentClassName, meta, ctx);
          const newContent = previousContent
            ? previousContent.replace(/\/\/auto-start([\s\S]+?)\/\/auto-end/m, content)
            : content;

          Object.values(ctx.styling).map((s) =>
            String(s)
              .split(" ")
              .forEach((cln) => Object.assign(allStylings, { [cln]: true }))
          );
          // console.log(componentClassName, ctx.styling)

          writeFileContent(
            withPathBase(`${componentClassName}.styles.ts`),
            `export enum C {\n${mapEntries(ctx.styling, (id, s) => `  "${id}" = "${s}",`).join("\n")}\n}\n`
          );

          writeFileJsonContent(withPathBase(`${componentClassName}.meta.json`), { ...meta });

          writeFileContent(withPathBase(`${componentClassName}.tsx`), prettify(newContent));

          writeStory(withPathBase(`${componentClassName}.stories.ts`), componentClassName, meta);

          writeFileContent(withPathBase(`index.ts`), `export * from "./${componentClassName}";`);

          return meta;
        }
      })
      ?.filter(Boolean) ?? [];

  transformFileJsonContent([outputDir, `package.json`], (input: object | null) => ({
    ...(input ?? { name: "snippets", version: "1.0.0" }),
    timestamp: Date.now(),
    figma,
    components: componentNames?.map(({ id, name, group, labels, description }) => ({
      id,
      name,
      group,
      description,
      labels: labels?.join(","),
    })),
  }));

  writeFileContent([outputDir, `index.ts`], componentNames?.map((n) => `export * from "./${n.id}";`).join("\n"));

  const allClassNames = Object.keys(allStylings).join(" ");
  writeFileContent(
    [outputDir, `index.html`],
    `<html><body class="${allClassNames}"><h1>Class names Summary</h1><pre>${allClassNames}</pre></body></html>`
  );

  console.log("✅ Generated React.");
}
function main() {
  doGenereact();
  doGenerateSvg();
}
main();
