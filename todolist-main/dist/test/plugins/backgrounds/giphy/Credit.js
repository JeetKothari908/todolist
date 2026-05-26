"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const giphy_logo_png_1 = __importDefault(require("./giphy-logo.png"));
const Credit = ({ link }) => (react_1.default.createElement("div", { className: "credit" },
    react_1.default.createElement("a", { href: link || "https://giphy.com/", target: "_blank", rel: "noopener noreferrer" },
        react_1.default.createElement("img", { src: giphy_logo_png_1.default }))));
exports.default = Credit;
//# sourceMappingURL=Credit.js.map