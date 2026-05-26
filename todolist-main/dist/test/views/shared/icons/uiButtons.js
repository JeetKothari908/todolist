"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapseIcon = exports.ExpandIcon = exports.DownIcon = exports.UpIcon = exports.RemoveIcon = void 0;
const react_1 = __importDefault(require("react"));
const Icon_1 = __importDefault(require("./Icon"));
// Actions
const RemoveIcon = () => react_1.default.createElement(Icon_1.default, { name: "trash-2" });
exports.RemoveIcon = RemoveIcon;
// Arrows
const UpIcon = () => react_1.default.createElement(Icon_1.default, { name: "arrow-up" });
exports.UpIcon = UpIcon;
const DownIcon = () => react_1.default.createElement(Icon_1.default, { name: "arrow-down" });
exports.DownIcon = DownIcon;
// Toggles
const ExpandIcon = () => react_1.default.createElement(Icon_1.default, { name: "plus" });
exports.ExpandIcon = ExpandIcon;
const CollapseIcon = () => react_1.default.createElement(Icon_1.default, { name: "minus" });
exports.CollapseIcon = CollapseIcon;
//# sourceMappingURL=uiButtons.js.map