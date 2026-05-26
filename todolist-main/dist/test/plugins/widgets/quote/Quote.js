"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const utils_1 = require("../../../utils");
const api_1 = require("./api");
require("./Quote.sass");
const types_1 = require("./types");
const EXPIRE_IN = 1 * utils_1.HOURS;
const Quote = ({ cache, data = types_1.defaultData, setCache, loader, }) => {
    (0, hooks_1.useCachedEffect)(() => {
        var _a;
        (0, api_1.getQuote)(loader, (_a = data.category) !== null && _a !== void 0 ? _a : "inspire").then(setCache);
    }, cache ? cache.timestamp + EXPIRE_IN : 0, [data.category]);
    if (!cache) {
        return null;
    }
    return (react_1.default.createElement("div", { className: "Quote" },
        react_1.default.createElement("h4", { className: "QuoteContent" },
            "\u201C",
            cache.quote,
            "\u201D",
            cache.author && (react_1.default.createElement("sub", { className: "QuoteAuthor" }, cache.author)))));
};
exports.default = Quote;
//# sourceMappingURL=Quote.js.map