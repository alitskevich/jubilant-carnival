export default class Expression {

    constructor(message) {
        var reg, src;
        this.message = message;
        reg = {};
        src = this.sources = [];
        this.body = this.message.replace(/<(@?[\w\.$ ]+?)>/gm, function(s, path) {
            var flag, id, prop, ref, ref1;
            ref = path.split(' '), path = ref[0], flag = ref[1];
            ref1 = path[0] === '@' ? ['@', path.slice(1)] : path.split("."), id = ref1[0], prop = ref1[1];
            if (!prop) {
                prop = "value";
            }
            path = id + "." + prop;
            if (!id) {
                throw new Error("No id for binding source in " + s);
            }
            if (!reg[path]) {
                reg[path] = 1;
                src.push({
                    id: path,
                    flag: flag,
                    entityId: id,
                    propId: prop
                });
            }
            return "$[\"" + path + "\"]";
        });
        this.expression = Function.create(this.body, ['$']);
    }
}