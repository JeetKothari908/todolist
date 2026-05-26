"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const icons_json_1 = __importDefault(require("feather-icons/dist/icons.json"));
const react_1 = __importDefault(require("react"));
const Icon = ({ colour = "currentColor", name, size = 24 }) => (react_1.default.createElement("i", null,
    react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: colour, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", dangerouslySetInnerHTML: { __html: icons_json_1.default[name] } })));
exports.default = Icon;
//# sourceMappingURL=Icon.js.map