"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const CssSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "CssSettings" },
    react_1.default.createElement("label", null,
        "CSS Snippet",
        react_1.default.createElement("textarea", { rows: 3, style: { fontFamily: "monospace" }, value: data.input, onChange: (event) => setData({ input: event.target.value }) })),
    react_1.default.createElement("p", { className: "info" }, "Warning: this functionality is intended for advanced users. Custom styles may break at any time.")));
exports.default = CssSettings;
//# sourceMappingURL=CssSettings.js.map