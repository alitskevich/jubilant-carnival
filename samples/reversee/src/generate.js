"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTemplatesToFile = exports.applyTemplates = exports.createTemplatesApplicators = exports.createTemplateApplicator = exports.createRegExp = void 0;
var iterate_1 = require("ultimus-fs/src/iterate");
var core_1 = require("ultimus-fs/src/core");
function createRegExp(str, keys, options) {
    if (keys === void 0) { keys = []; }
    if (options === void 0) { options = "gim"; }
    var expr = str
        .replace(/[.*+?^$()|[\]\\]/g, "\\$&")
        .replace(/\{@(\w+)(:?=([^}]+))?\}/g, function (_, key, pattern) {
            if (pattern === void 0) { pattern = "\\S+"; }
            keys.push(key);
            return "(".concat(pattern, ")");
        })
        .replace(/[{}]/g, "\\$&")
        .replace(/\s+/g, "\\s+");
    // console.log(expr);
    var regexp = new RegExp(expr, options);
    return regexp;
}
exports.createRegExp = createRegExp;
function createTemplateApplicator(str) {
    var keys = [];
    var regexp = createRegExp(str, keys);
    var applicator = function (s, compId) {
        var props = {};
        return s.replaceAll(regexp, function (_) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            args.pop();
            args.pop();
            args.forEach(function (val, index) {
                props[keys[index]] = val;
            });
            return "<".concat(compId, " ").concat(Object.entries(props)
                .filter(function (_a) {
                    var _ = _a[0], v = _a[1];
                    return !!v;
                })
                .map(function (_a) {
                    var k = _a[0], v = _a[1];
                    return "".concat(k, "=").concat((v === null || v === void 0 ? void 0 : v[0]) === "{" ? v : "\"".concat(v, "\""));
                })
                .join(" "), "/>");
        });
    };
    return applicator;
}
exports.createTemplateApplicator = createTemplateApplicator;
var createTemplatesApplicators = function (cdir) {
    var applicators = {};
    (0, iterate_1.mapFilesInDirectory)(cdir, function (f, dir) {
        if (f === "index.ts")
            return;
        var content = (0, core_1.readFileContent)([dir, f]);
        content === null || content === void 0 ? void 0 : content.replace(/<component\s+id="(.+)">([\s\S]*?)<\/component>/gm, function (_, tag, template) {
            applicators[tag] = createTemplateApplicator(template.trim());
            return "";
        });
    });
    return applicators;
};
exports.createTemplatesApplicators = createTemplatesApplicators;
var applyTemplates = function (input, templatesDir) {
    var applicators = (0, exports.createTemplatesApplicators)(templatesDir);
    var output = Object.entries(applicators).reduce(function (text, _a) {
        var compId = _a[0], fn = _a[1];
        return fn(text, compId);
    }, input);
    return output;
};
exports.applyTemplates = applyTemplates;
var applyTemplatesToFile = function (file, templatesDir) {
    (0, core_1.transformFileContent)(file, function (input) { return (0, exports.applyTemplates)(input, templatesDir); });
};
exports.applyTemplatesToFile = applyTemplatesToFile;
