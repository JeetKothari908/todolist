"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const icons_1 = require("./icons");
const Crashed = () => (react_1.default.createElement("div", { className: "Crashed" },
    react_1.default.createElement(icons_1.Icon, { name: "alert-triangle" }),
    " Sorry this plugin has crashed!"));
exports.default = Crashed;
//# sourceMappingURL=Crashed.js.map