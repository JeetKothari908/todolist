"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const IntlTime_1 = __importDefault(require("./IntlTime"));
const Digital = (props) => (react_1.default.createElement("div", { className: "Time Digital" },
    react_1.default.createElement("h1", null,
        react_1.default.createElement(IntlTime_1.default, Object.assign({}, props)))));
exports.default = Digital;
//# sourceMappingURL=Digital.js.map