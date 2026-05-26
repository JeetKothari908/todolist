"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const LiteratureClockSettings = ({ data = types_1.defaultData, setData, }) => (react_1.default.createElement("div", { className: "LiteratureClockSettings" },
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.showBookAndAuthor, onChange: () => setData(Object.assign(Object.assign({}, data), { showBookAndAuthor: !data.showBookAndAuthor })) }),
        " ",
        "Display book and author"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.centerText, onChange: () => setData(Object.assign(Object.assign({}, data), { centerText: !data.centerText })) }),
        " ",
        "Align text at center")));
exports.default = LiteratureClockSettings;
//# sourceMappingURL=LiteratureClockSettings.js.map