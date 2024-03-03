// const fileKey = "HJZ2n7avAOMFJnyh9TYAuO";

export async function fetchFigmaApi(path: string) {
  const url = `https://api.figma.com/v1/${path}`; //`;?geometry=paths

  const token = window.localStorage.getItem('figma_token');

  if (!token) {
    return Promise.resolve({ error: { message: 'No Figma API token' } });
  }

  return fetch(url, {
    headers: {
      "X-Figma-Token": token,
    },
  })
    .then((r) => r.json())
    .then((json) => {
      // log(json, "json");
      if (json.err) {
        return { error: { message: json.err } };
      }
      return json;
    })
    .catch((error) => ({ error: { message: error.message } }));
}
