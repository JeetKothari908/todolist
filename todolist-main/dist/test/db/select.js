"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectWidgets = void 0;
const lib_1 = require("../lib");
const state_1 = require("./state");
/** Select widgets from database */
const selectWidgets = () => {
    return Array.from(lib_1.DB.prefix(state_1.db, "widget/"))
        .map(([, val]) => val)
        .filter((val) => val !== null)
        .sort((a, b) => a.order - b.order);
};
exports.selectWidgets = selectWidgets;
//# sourceMappingURL=select.js.map