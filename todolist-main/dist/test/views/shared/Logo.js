"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Logo.css");
const tabliss_svg_1 = __importDefault(require("./tabliss.svg"));
const Logo = () => (react_1.default.createElement("h1", { className: "Logo" },
    react_1.default.createElement("i", { dangerouslySetInnerHTML: { __html: tabliss_svg_1.default } })));
exports.default = Logo;
//# sourceMappingURL=Logo.js.map