"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const Css = ({ data = types_1.defaultData }) => {
    react_1.default.useLayoutEffect(() => {
        const style = document.createElement("style");
        style.id = "CustomCss";
        style.type = "text/css";
        style.appendChild(document.createTextNode(data.input || ""));
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, [data.input]);
    return null;
};
exports.default = Css;
//# sourceMappingURL=Css.js.map