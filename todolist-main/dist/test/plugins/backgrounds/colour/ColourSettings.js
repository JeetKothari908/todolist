"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const ColourSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "ColourSettings" },
    react_1.default.createElement("label", null,
        "Colour",
        react_1.default.createElement("input", { type: "color", value: data.colour, onChange: (event) => setData({ colour: event.target.value }) }))));
exports.default = ColourSettings;
//# sourceMappingURL=ColourSettings.js.map