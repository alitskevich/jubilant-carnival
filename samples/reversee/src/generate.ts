import { Fn, Hash, StringHash } from "ultimus";
import { mapFilesInDirectory } from "ultimus-fs/src/iterate";
import { Path } from "ultimus-fs/types";
import { readFileContent, transformFileContent } from "ultimus-fs/src/core";

export function createRegExp(str: string, keys: string[] = [], options = "gim") {
  const expr = str
    .replace(/[.*+?^$()|[\]\\]/g, "\\$&")
    .replace(/\{@(\w+)(:?=([^}]+))?\}/g, (_: any, key: any, pattern = "\\S+") => {
      keys.push(key);
      return `(${pattern})`;
    })
    .replace(/[{}]/g, "\\$&")
    .replace(/\s+/g, "\\s+");

  // console.log(expr);

  const regexp = new RegExp(expr, options);

  return regexp;
}

export function createTemplateApplicator(str: any) {
  const keys: string[] = [];
  const regexp = createRegExp(str, keys);

  const applicator = (s: string, compId: any): string => {
    const props: StringHash = {};
    return s.replaceAll(regexp, (_: any, ...args: any[]) => {
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

export const createTemplatesApplicators = (cdir: Path) => {
  const applicators: Hash<Fn> = {};

  mapFilesInDirectory(cdir, (f: string, dir) => {
    if (f === "index.ts") return;
    const content = readFileContent([dir, f]);
    content?.replace(
      /<component\s+id="(.+)">([\s\S]*?)<\/component>/gm,
      (_: any, tag: string | number, template: string) => {
        applicators[tag] = createTemplateApplicator(template.trim());
        return "";
      }
    );
  });

  return applicators;
};

export const applyTemplates = (input: string, templatesDir: Path) => {
  const applicators = createTemplatesApplicators(templatesDir);
  const output = Object.entries(applicators).reduce((text, [compId, fn]) => fn(text, compId), input);
  return output;
};

export const applyTemplatesToFile = (file: Path, templatesDir: Path) => {
  transformFileContent(file, (input: any) => applyTemplates(input, templatesDir));
};
