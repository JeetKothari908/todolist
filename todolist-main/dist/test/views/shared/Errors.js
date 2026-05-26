"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const error_1 = require("../../contexts/error");
const Modal_1 = __importDefault(require("./modal/Modal"));
const Errors = ({ onClose }) => {
    const { errors } = react_1.default.useContext(error_1.ErrorContext);
    return (react_1.default.createElement(Modal_1.default, { onClose: onClose },
        react_1.default.createElement("div", { className: "Settings" },
            react_1.default.createElement("a", { className: "button button--primary", href: "https://tabliss.io/support.html", target: "_blank", rel: "noopener noreferrer", style: { float: "right", fontSize: "1.1em" } }, "Visit support"),
            react_1.default.createElement("h2", { style: { margin: 0 } }, "Errors"),
            errors.map((error, index) => (react_1.default.createElement("div", { key: index, className: "Widget" }, error.message))))));
};
exports.default = Errors;
//# sourceMappingURL=Errors.js.map