const HEADER_RENDER = function (table, h) {
    return this.name || this.caption || table.string(this.id);
};

const CELL_RENDER = function (d, table, h) {
    return d[this.id]
};

export const normalizeProps = function (p) {
    let offset = 0;
    // normalize headers
    p.headers.forEach(function (h, index) {
        h.width = h.width || p.colWidth;
        h.index = index;
        h.offset = offset;

        offset += h.width;

        h.render = h.render || HEADER_RENDER;
        h.renderCell = h.renderCell || CELL_RENDER;
    });

    return p;
};