const fetch = require("nodejs-fetch");
const path = require("path");
const fs = require("node:fs");
const { pipeline, PassThrough } = require("node:stream");
const StreamValues = require("stream-json/streamers/StreamValues");
const zlib = require("zlib");
const { readEnvFromFile } = require("../utils/readEnvFromFile");

const envParamsInfo = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: {
    alias: "PROJECT_ID",
    required: true,
  },
  DATASET: {
    alias: "DATASET",
    defaultValue: "staging",
  },
};

const { DATASET, PROJECT_ID } = readEnvFromFile(path.resolve(__dirname, "../../.env.local"), envParamsInfo);

const TYPES_MAP = {
  post: "PostDocument",
};

console.log("\nPull data");

const nowDate = new Date().toISOString();

const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/export/${DATASET}/`;

const createCollectionPipe = (collId) => {
  const input = new PassThrough({ objectMode: true });
  pipeline(
    input,
    async function* (source, { signal }) {
      let counter = 0;
      const type = TYPES_MAP[collId] ?? "CmsDocument";
      yield `/* eslint-disable  */
// prettier-ignore
// @ts-nocheck
import type { ${type} } from 'declarations';

// Auto-generated file. Do not edit.
// Pulled from CMS at ${nowDate}

/**
 * \`${collId}\` collection.
 */
export const DATA: ${type}[] = [
  `;

      for await (const chunk of source) {
        if (counter++) {
          yield ",\n  ";
        }
        yield await JSON.stringify(chunk, null, 2).replace(/\n/g, "\n  ");
      }
      yield `\n];\n`;
    },
    fs.createWriteStream("../data/collections/" + collId + ".data.ts"),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
  return input;
};

const main = () => {
  const collectors = {};
  fetch(API_URL).then((response) => {
    pipeline(
      response.body,
      StreamValues.withParser(),
      async function* (source, { signal }) {
        for await (const chunk of source) {
          const val = chunk.value;
          const collId = val._type;
          if (collId in TYPES_MAP) {
            const next = collectors[collId] || (collectors[collId] = createCollectionPipe(collId));
            next.write(val);
          }
          yield JSON.stringify(val) + "\n";
        }
      },
      zlib.createGzip({ level: 9 }),
      fs.createWriteStream("../data/dumps/dump.txt.zip"),
      (err) => {
        if (err) {
          console.error(err);
        }
        Object.values(collectors).forEach((collector) => collector.end());

        const indexContentHeader = `/* eslint-disable  */
// @ts-nocheck
import { CmsDocument  } from 'declarations';

// Auto-generated file. Do not edit.
// Pulled from CMS at ${nowDate}

/**
 * CMS data collections index.
 */
`;
        const indexContent =
          indexContentHeader +
          Object.keys(collectors)
            .map((key) => `import { DATA as ${key} } from './collections/${key}.data'`)
            .join("\n") +
          "\n\nexport const CMS: Record<string, CmsDocument[]> = {\n  " +
          Object.keys(collectors)
            .map((key) => `${key}`)
            .join(",\n  ") +
          ",\n};";

        fs.writeFileSync("../data/collections/index.ts", indexContent);
        console.log("Count of collections:", Object.values(collectors).length);
      }
    );
  });
};

main();
