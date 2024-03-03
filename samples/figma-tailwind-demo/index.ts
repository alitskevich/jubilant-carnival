import uiCommons from "arrmatura-ui";
import launchWeb from "arrmatura-web";
import resources from "./resources";
import componentsTemplates from "./components";
import { arraySortBy } from "ultimus";
import { buildTree, normalizeInput } from "figma-tailwind";
import { ANode } from "figma-tailwind";
import * as lib from "ultimus";
import { loadFigmaFileSource } from "./src/loadFigmaFileSource";

let top;

async function main() {
  top?.done();

  const { params } = lib.urlParse(window.location.href);

  const {
    file: fileKey = "bXt9NPqRZ82YO4IUCIdrpO",
    token = "figd_mYOOCbB09rPHMKpxIDGSimPhqKATx2ls-OUmjGzT",
  } = params;

  if (token) {
    window.localStorage.setItem('figma_token', token);
  }

  const input = await loadFigmaFileSource(fileKey);

  const { nodes } = normalizeInput(input);

  const root = buildTree({ nodes });

  const nodesList = arraySortBy<ANode>(root.nodes as any).map((n) => ({
    ...n,
    markup: n.toHtml(),
    name: n.componentName ?? n.name ?? n.tag,
    grouping: n.name.split(/\W/)[0],
    node: nodes.find(({ id }) => id === n.id),
  }));

  const pages = nodesList.filter((n) => n.type === "PAGE").map((n) => ({ ...n, grouping: "PAGES" }));
  const vectors = nodesList.filter((n) => n.type === "VECTOR").map((n) => ({ ...n, grouping: "SVG" }));
  const components = nodesList
    // .filter((n) => n.type.startsWith("COMPONENT"))
    .map((n) => ({ ...n }));

  const contentTemplates = root.toHtml();

  // log("components", contentTemplates);

  top = launchWeb({
    types: [...uiCommons, contentTemplates, ...componentsTemplates],
    resources: {
      ...resources,
      pages: [...resources.extraPages, ...pages],
      components,
      vectors,
    },
  });
}

main();
