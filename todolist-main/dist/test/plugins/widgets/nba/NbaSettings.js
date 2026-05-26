"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const NbaSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "NbaSettings" },
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.displayLogo, onChange: () => setData(Object.assign(Object.assign({}, data), { displayLogo: !data.displayLogo })) }),
        " ",
        "Display team logo")));
exports.default = NbaSettings;
//# sourceMappingURL=NbaSettings.js.map