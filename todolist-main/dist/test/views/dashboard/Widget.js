"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Widget = ({ children, colour, fontFamily, fontSize = 24, fontWeight, }) => (react_1.default.createElement("div", { className: `Widget ${fontWeight ? "weight-override" : ""}`, style: {
        color: colour,
        fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight,
    } }, children));
exports.default = Widget;
//# sourceMappingURL=Widget.js.map