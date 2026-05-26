"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const Colour = ({ data = types_1.defaultData }) => (react_1.default.createElement("div", { className: "Colour fullscreen", style: { backgroundColor: data.colour } }));
exports.default = Colour;
//# sourceMappingURL=Colour.js.map