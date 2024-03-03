# Figmatron

This is HTML/Tailwind components generator from Figma REST API (v.1)

## How to use

```js
  const text = await doFetchFigmaFile(figmaFileKey));

  const json = JSON.parse(text);

  const { nodes, meta } = normalizeInput(input);

  const root = buildTree({ nodes });

  const html = root.toHtml();

```

## How it works.

Generator produces UI metadata specification as a set of HTML-like components, which are corresponding to each figma component (type `COMPONENT-SET`, `COMPONENT` and `INSTANCE`).

Generation starts from top-level nodes on each canvas, that have `page-` prefix in its names.

All stylings and layouts are transpiled into Tailwind classes.

### Design Rules.

- Components MUST have unique name.
- frames and group could be turned into specific html tags id it is named with `html-` prefix, e.g. `html-input`.
- Graphics (type `VECTOR`) entities are not supported. Use `icon-` or `svg-` prefixes on some upper containers of them to produce stub HTML components instead of.
- Use `ignore-` name prefix to skip specific nodes
- Use `stub-` name prefix to generate placeholder without inner content.
