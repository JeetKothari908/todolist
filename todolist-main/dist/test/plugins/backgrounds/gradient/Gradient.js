"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const Gradient = ({ data = types_1.defaultData }) => (react_1.default.createElement("div", { className: "Gradient fullscreen", style: {
        backgroundImage: `${data.type}(${data.angle}deg, ${data.from}, ${data.to})`,
    } }));
exports.default = Gradient;
//# sourceMappingURL=Gradient.js.map