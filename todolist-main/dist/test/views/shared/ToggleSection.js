"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../hooks");
const ToggleSection = ({ name, children }) => {
    const [isOpen, toggleOpen] = (0, hooks_1.useToggle)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("p", null,
            react_1.default.createElement("a", { onClick: toggleOpen },
                isOpen ? "Close" : "Open",
                " ",
                name)),
        isOpen && children));
};
exports.default = ToggleSection;
//# sourceMappingURL=ToggleSection.js.map