import { LocalDbStore } from "arrmatura-ui/support/LocalDbStore";
import { fetchFigmaApi } from "./fetchFigmaApi";


export async function loadFigmaFileSource(fileKey: string) {

  const db = new LocalDbStore(`figma`);

  let input = await db.getItem(fileKey);

  if (input) {
    fetchFigmaApi(`files/${fileKey}/versions?page_size=1`).then(async ({ versions }) => {
      if (versions?.[0]?.id !== input.version) {
        input = await fetchFigmaApi(`files/${fileKey}`);
        if (!input.error) {
          db.setItem(fileKey, input);
          window.location.reload();
        }
      }
    });

    return input;
  }

  window.document.title = 'Loading...';

  input = await fetchFigmaApi(`files/${fileKey}`);
  if (!input.error) {
    db.setItem(fileKey, input);
  }

  window.document.title = 'SOT';

  return input;
}
