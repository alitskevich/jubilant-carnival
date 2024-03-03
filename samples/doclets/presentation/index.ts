const { lib } = window.arrmatura;

const { params } = lib.urlParse(window.location.href);
const { key, meta } = params;
const metaUrl = meta ?? (key ? `https://script.google.com/macros/s/${key}/exec?action=meta` : "slides.json");

document.title = "...loading";

function bff(doc) {
  let Counter = 0;

  const stylers = {
    width: (val, key) => `${key}:${val}px`,
    height: (val, key) => `${key}:${val}px`,
    minimumHeight: (val, key) => `min-height:${val}px`,
    paddingLeft: (val, key) => `padding-left:${val}px`,
    paddingRight: (val, key) => `padding-right:${val}px`,
    paddingTop: (val, key) => `padding-top:${val}px`,
    paddingBottom: (val, key) => `padding-bottom:${val}px`,
    borderColor: (val, key) => `border-color:${val}`,
    backgroundColor: (val, key) => `background-color:${val}`,
    color: (val, key) => `color:${val?.[0] === "#" ? val : `var(--${val}-color)`}`,
    verticalAlignment: (val, key) => `vertical-align:${val}`,
    fontFamily: (val, key) => `font-family:${val}`,
    fontSize: (val, key) => `font-size:${val}px`,
    fontWeight: (val, key) => `font-weight:${val}`,
    bold: (val, key) => `font-weight:${val === "true" ? "bold" : "normal"}`,
    textAlignment: (val, key) => `text-align:${val === "right" ? "right" : val};`,
  };

  function resolveStyle(style) {
    return style
      ? Object.entries(style)
        .map(([key, val]) => (stylers[key] ? stylers[key](val, key) : `${key}:${val}`))
        .join(";")
      : "";
  }

  function resolveTransformStyle(style = {}) {
    const { scaleX = 1, shearX = 0, translateX = 0, shearY = 0, scaleY = 1, translateY = 0 } = style;
    return `;position: absolute; top:0; left:0;transform: matrix(${scaleX},${shearY},${shearX},${scaleY},${translateX},${translateY});`;
  }

  function content(data, level = 1) {
    return data?.map(({ text, style, children, rows, cols, transform = {}, ...rest }, index) => {
      const id = ++Counter;
      const { scaleX = 1, translateX = 0, scaleY = 1, translateY = 0 } = transform;

      return {
        ...rest,
        text: {
          ...text,
          values: text?.values?.map((v, id) => ({
            value: v.value,
            id,
            style: resolveStyle(v.style),
          })),
          style: resolveStyle(text?.style),
        },
        id,
        level,
        area: String.fromCharCode("a".charCodeAt(0) + index),
        style: `${resolveStyle(style)}`,
        translate: `${resolveTransformStyle({ translateX, translateY })}`,
        scale: { width: scaleX, height: scaleY },
        children: content(children, level + 1),
        rows: content(rows, level + 1),
        cols: content(cols, level + 1),
      };
    });
  }
  const resources = {
    params,
    name: doc.name,
    app: {
      backgroundImage: doc.slides[0]?.background?.url,
    },
    slides: doc.slides.map((s, id) => ({
      ...s,
      id,
      children: content(s.children),
    })),
  };
  console.log(doc, resources);
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
  fetch("slides.xml").then((res) => res.text()),
]).then(([resources, types]) => {
  window.arrmatura({ template, types, resources, functions });
});
