import { parseJson } from "ultimus";
// @see https://github.com/didoo/figma-api/blob/main/src/utils.ts

export async function fetchFigmaFile(url: string, token: string) {
  const escape = (s) => s.replaceAll(/\u2028/g, "@");

  console.log("Fetch from url", url);

  return await fetch(url, {
    headers: {
      "X-Figma-Token": token,
    },
  })
    .then((r) => r.text())
    .then(escape)
    .then(parseJson)
    .then(({ err, ...out }) => {
      if (err) throw new Error(err);
      return out;
    })
    .catch((error) => ({ error: { message: error.message } }));
}
