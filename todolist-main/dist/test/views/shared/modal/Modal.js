"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Modal.css");
const Modal = ({ children, onClose }) => {
    return (react_1.default.createElement("div", { className: "Modal-container", onClick: onClose },
        react_1.default.createElement("div", { className: "Modal", onClick: (event) => event.stopPropagation() }, children)));
};
exports.default = Modal;
//# sourceMappingURL=Modal.js.map