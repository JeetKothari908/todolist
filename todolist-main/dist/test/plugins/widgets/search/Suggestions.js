"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Suggestions.sass");
const Suggestions = ({ active, setActive, suggestions, onSelect, }) => {
    return (react_1.default.createElement("div", { className: "Suggestions" }, suggestions.map((suggestion, index) => (react_1.default.createElement("input", { type: "button", key: index, className: index === active ? "active" : "", value: suggestion, onClick: () => onSelect(suggestion), onMouseEnter: () => setActive(index), onMouseLeave: () => setActive(undefined) })))));
};
exports.default = Suggestions;
//# sourceMappingURL=Suggestions.js.map