"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const hooks_1 = require("../../../hooks");
const api_1 = require("./api");
const types_1 = require("./types");
require("./LiteratureClock.sass");
const LiteratureClock = ({ cache, data = types_1.defaultData, setCache, }) => {
    const time = (0, hooks_1.useTime)();
    const timeCode = (0, api_1.getTimeCode)(time);
    (0, react_1.useEffect)(() => {
        (0, api_1.getQuoteByTimeCode)(timeCode).then(setCache);
    }, [timeCode]);
    if (!cache) {
        return null;
    }
    return (react_1.default.createElement("div", { className: `LiteratureClock ${data.centerText ? "center" : ""}` },
        react_1.default.createElement("blockquote", null,
            react_1.default.createElement("span", { className: "quote_first" }, cache.quote_first),
            react_1.default.createElement("strong", { className: "quote_time_case" }, cache.quote_time_case),
            react_1.default.createElement("span", { className: "quote_last" }, cache.quote_last)),
        data.showBookAndAuthor && cache.title && cache.author && (react_1.default.createElement("cite", null,
            "\u2014",
            react_1.default.createElement("span", { id: "book" }, cache.title),
            ", ",
            react_1.default.createElement("span", { id: "author" }, cache.author)))));
};
exports.default = LiteratureClock;
//# sourceMappingURL=LiteratureClock.js.map