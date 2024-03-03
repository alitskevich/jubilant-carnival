const { lib } = window.arrmatura;

const { params } = lib.urlParse(window.location.href);
const { key, meta } = params;
const metaUrl = meta ?? (key ? `https://script.google.com/macros/s/${key}/exec?action=meta` : "sheets/sample.json");

document.title = "... loading";

document.getElementsByTagName("head")[0].appendChild(
  Object.assign(document.createElement("script"), {
    src: "vendor/showdown.min.js",
  })
);

const functions = {
  richText(rootElement, markup) {
    const html = new window.showdown.Converter().makeHtml(markup);
    rootElement.innerHTML = html;
  },
};

const kbAdapter = (list) => {
  let chapterCursor = null;
  let sectionCursor = null;
  let blockCursor = null;
  const tree = {
    main: {
      id: "0",
      name: "",
      data: {
        0: {
          id: "0",
          data: { 0: { id: "0", data: [{ id: "hero", type: "hero" }] } },
        },
      },
    },
  };

  list.forEach((item) => {
    const { $row, id = $row, chapter, section, block, value, ...e } = item;
    if (chapter) {
      chapterCursor = tree[chapter] = {
        id: chapter,
        value,
        name: chapter,
        data: {},
      };
      sectionCursor = null;
      blockCursor = null;
    } else if (section) {
      sectionCursor = chapterCursor.data[section] = {
        id: `${chapterCursor.id}/${id}`,
        name: section,
        value,
        data: {},
      };
      blockCursor = null;
    } else if (block) {
      if (!sectionCursor) {
        sectionCursor = chapterCursor.data["-"] = {
          id: `${chapterCursor.id}/0`,
          data: {},
        };
      }
      blockCursor = sectionCursor.data[block] = {
        id: `${chapterCursor.id}/${sectionCursor.id}/${id}`,
        name: block,
        value,
        data: [],
      };
    } else {
      if (!chapterCursor) {
        chapterCursor = tree["0"] = { id: "0", data: {} };
      }
      if (!sectionCursor) {
        sectionCursor = chapterCursor.data["-"] = {
          id: `${chapterCursor.id}/0`,
          data: {},
        };
      }
      if (!blockCursor) {
        blockCursor = sectionCursor.data["-"] = {
          id: `${chapterCursor.id}/${sectionCursor.id}/0`,
          data: [],
        };
      }
      blockCursor.data.push({ ...e, name: e.key, value, id });
    }
  });

  Object.values(tree).forEach((chapter) =>
    Object.assign(chapter, {
      data: Object.values(chapter.data).map((section) => ({
        ...section,
        data: Object.values(section.data),
      })),
    })
  );

  return { data: tree };
};

Promise.all([fetch(metaUrl).then((res) => res.json()), fetch("sheets/sheets.xml").then((res) => res.text())]).then(
  ([{ enums, data = [], ...rest }, types]) => {
    const resources = {
      params,
      enums,
      ...rest,
      ...kbAdapter(data, enums),
    };

    window.arrmatura({ template: "<App />", types, resources, functions });
  }
);
