"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const categories_1 = __importDefault(require("./categories"));
const types_1 = require("./types");
const QuoteSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "QuoteSettings" },
    react_1.default.createElement("h5", null, "Daily Quotes"),
    categories_1.default.map((category) => (react_1.default.createElement("label", { key: category.key },
        react_1.default.createElement("input", { type: "radio", checked: data.category === category.key, onChange: () => setData({ category: category.key }) }),
        " ",
        category.name))),
    react_1.default.createElement("p", null,
        "Powered by",
        " ",
        react_1.default.createElement("a", { href: "https://theysaidso.com/", target: "_blank", rel: "noopener noreferrer" }, "They Said So")),
    react_1.default.createElement("h5", null, "Hourly Quotes"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "radio", checked: data.category === "developerexcuses", onChange: () => setData({ category: "developerexcuses" }) }),
        " ",
        "Developer Excuses"),
    react_1.default.createElement("p", null,
        "Powered by",
        " ",
        react_1.default.createElement("a", { href: "http://www.developerexcuses.com/", target: "_blank", rel: "noopener noreferrer" }, "Developer Excuses"))));
exports.default = QuoteSettings;
//# sourceMappingURL=QuoteSettings.js.map