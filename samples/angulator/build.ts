import {
  mapDirectoryRecurrsive,
  readFileContent,
  readFileJsonContent,
  writeFileContent,
  writeFileJsonContent,
} from "ultimus-fs";
import { parseNgTemplate } from "./src/parseNgTemplate";
import { generateComponentsFromNg } from "./src/generateComponentsFromNg";
import { properCase } from "ultimus";
import { parseNgService } from "./src/parseNgService";
import { parseInterfaces } from "./src/parseInterfaces";

const outputDir = "xml";

export function doGenerateFile(file) {
  const fname = file.replace(".json", "");

  const properName = properCase(fname.replace(".", "-"), "-");

  const input = readFileJsonContent(["json", `${file}`]);

  const output = generateComponentsFromNg(input, properName);

  writeFileContent([outputDir, `${properName}.xml`], output);

  console.log(`✅ Generated ${file}`);

  return fname;
}

export function doParseNgTemplate(name, path) {
  const input = readFileContent([path, name]);

  console.log(`✅ Parsing ${name}`);
  const output = parseNgTemplate(input);

  writeFileJsonContent(["json", `${name.replace(".html", "")}.json`], output);
}

export function doParseNgServices(dir) {
  const services = mapDirectoryRecurrsive(dir, ({ path, name }) => {
    if (name.endsWith(".service.ts")) {
      const input = readFileContent([path, name]);
      // console.log(`✅ Parsing ${name}`);
      const opts = {
        package: `${path.replace("services", "")}/${name.split(".")[0]}`,
      };
      const output = parseNgService(input, opts);
      console.log(`✅ Parsed`, output);
      return output;
    }
    return [];
  });
  writeFileJsonContent(["json", `services.json`], ([] as any[]).concat(...(services ?? [])));
}
export function doParseInterfaces(dir) {
  const services = mapDirectoryRecurrsive(dir, ({ path, name }) => {
    if (name.endsWith(".service.ts")) {
      const input = readFileContent([path, name]);
      // console.log(`✅ Parsing ${name}`);
      const opts = {
        package: `${path.replace("services", "")}/${name.split(".")[0]}`,
      };
      const output = parseInterfaces(input, opts);

      console.log(`✅ Parsed`, output);
      return output;
    }
    return [];
  });
  writeFileJsonContent(["json", `interfaces.json`], ([] as any[]).concat(...(services ?? [])));
}

export function main() {
  doParseInterfaces(["services"]);
  doParseNgServices(["services"]);
  // mapDirectoryRecurrsive(['pages'], ({ path, name }) => {
  //   if (name.endsWith('.html')) {
  //     doParseNgTemplate(name, path);
  //   }
  // })
  // const fileIds = mapDirectoryRecurrsive(['json'], ({ name }) => {
  //   return (name.endsWith('.json')) ? doGenerateFile(name) : null;
  // }).filter(Boolean)

  // writeFileJsonContent([outputDir, `index.json`], {
  //   pages: fileIds
  //     .map(n => n.split('.'))
  //     .map(([name, type]) => ({ id: String(`${name}-${type}`), type, name: properCase(`${name}-${type}`, '-') }))
  // });
  // writeFileContent([outputDir, `index.ts`],
  //   fileIds
  //     .map(n => n.replace('.', '-'))
  //     .map(name => `export * as ${properCase(name, '-')} from './${properCase(name, "-")}.xml';`).join(';\n')
  // );
}

main();
