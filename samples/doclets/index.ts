const { lib } = window.arrmatura;

const { params } = lib.urlParse(window.location.href);
const { key, meta } = params;
const metaUrl = meta ?? (key ? `https://script.google.com/macros/s/${key}/exec?action=meta` : "doc/doc.json");

document.title = "...loading";

function bff(doc) {
  let Counter = 0;

  function navTree(data, level = 1) {
    return data
      ?.filter((d) => d.className === `h${level}`)
      .map((d, id) => ({
        ...d,
        name: d.children?.find((c) => c.text)?.text,
        id: ++Counter,
        children: navTree(d.children, level + 1),
      }));
  }
  const stylers = {
    // "verticalAlignment:BOTTOM;fontFamily:Arial;paddingRight:2;paddingLeft:2;paddingTop:2;paddingBottom:2;background-color:#ff7800;width:75px;bold:true"
    width: (val, key) => `${key}:${val}px`,
    height: (val, key) => `${key}:${val}px`,
    minimumHeight: (val, key) => `min-height:${val}px`,
    paddingLeft: (val, key) => `padding-left:${val}px`,
    paddingRight: (val, key) => `padding-right:${val}px`,
    paddingTop: (val, key) => `padding-top:${val}px`,
    paddingBottom: (val, key) => `padding-bottom:${val}px`,
    borderColor: (val, key) => `border-color:${val}`,
    backgroundColor: (val, key) => `background-color:${val}`,
    verticalAlignment: (val, key) => `vertical-align:${val}`,
    fontFamily: (val, key) => `font-family:${val}`,
    bold: (val, key) => `font-weight:${val === "true" ? "bold" : "normal"}`,
    horizontalAlignment: (val, key) =>
      `display: flex; justify-content:${val === "RIGHT" ? "flex-end" : val.toLowerCase()};`,
  };
  function content(data, level = 1) {
    return data?.map(({ text, style, children, rows, cols, ...rest }) => {
      const id = ++Counter;

      return {
        ...rest,
        text,
        id,
        level,
        style: style
          ? Object.entries(style)
            .map(([key, val]) => (stylers[key] ? stylers[key](val, key) : `${key}:${val}`))
            .join(";")
          : undefined,
        children: content(children, level + 1),
        rows: content(rows, level + 1),
        cols: content(cols, level + 1),
      };
    });
  }
  const resources = {
    params,
    name: doc.name,

    content: content(doc.body),
    navTree: navTree(doc.body),
  };
  console.log(resources);
  return resources;
}

// pipes functions
const functions = {
  content(data) {
    return data.map((d, id) => ({ ...d, id }));
  },
};

// top-level component template
const template = "<App />";

Promise.all([
  fetch(metaUrl)
    .then((res) => res.json())
    .then(bff),
  fetch("doc/doc.xml").then((res) => res.text()),
]).then(([resources, types]) => {
  window.arrmatura({ template, types, resources, functions });
});
