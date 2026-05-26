"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(input) {
    var _a;
    return Object.assign(Object.assign(Object.assign(Object.assign({ background: input.backgrounds.find((background) => background.active) }, Object.fromEntries(input.widgets.map((widget, index) => [
        `widget/${widget.id}`,
        Object.assign(Object.assign({}, widget), { order: index }),
    ]))), Object.fromEntries(Object.entries(input.data).map(([key, val]) => [`data/${key}`, val]))), (input.locale ? { locale: input.locale } : {})), { timeZone: (_a = input.timeZone) !== null && _a !== void 0 ? _a : null, focus: false });
}
exports.default = default_1;
//# sourceMappingURL=migrate2.js.map