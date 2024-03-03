import emoji from "./index.json";
import { arrayGroupBy } from "ultimus";

type Item = (typeof emoji)[0];

const items = Object.values(arrayGroupBy<Item>(emoji, (e: any) => e.item || e.id)).map((e: any) => {
  const mainItem = e.items[0];
  const name = mainItem.item || mainItem.name;
  return {
    ...mainItem,
    id: e.id,
    items: e.items,
    name,
    count: e.items.length,
    tags: Object.keys(
      [String(e.tags || "")]
        .concat(...e.items.map((ee: Item) => ee.tags.split(",")))
        .map((s) => s.trim())
        .filter(Boolean)
        .reduce((r, e) => Object.assign(r, { [e]: 1 }), {})
    )
      .sort()
      .join(", "),
    searchData: [name]
      .concat(...e.items.map((ee: Item) => [ee.name, ee.kind, ee.domain, ee.tags]))
      .join(",")
      .replaceAll(" ", ","),
  };
});

export const resources = {
  items,
  forms: {
    filter: [
      { id: "domain", name: "Domain" },
      { id: "kind", name: "Kind" },
    ],
  },
};
