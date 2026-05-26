"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const shared_1 = require("../shared");
require("./PositionInput.css");
const positions = [
    {
        value: "topLeft",
        icon: "arrow-up-left",
    },
    {
        value: "topCentre",
        icon: "arrow-up",
    },
    {
        value: "topRight",
        icon: "arrow-up-right",
    },
    {
        value: "middleLeft",
        icon: "arrow-left",
    },
    {
        value: "middleCentre",
        icon: "move",
    },
    {
        value: "middleRight",
        icon: "arrow-right",
    },
    {
        value: "bottomLeft",
        icon: "arrow-down-left",
    },
    {
        value: "bottomCentre",
        icon: "arrow-down",
    },
    {
        value: "bottomRight",
        icon: "arrow-down-right",
    },
];
const PositionInput = ({ value, onChange }) => (react_1.default.createElement("div", { className: "PositionInput" },
    react_1.default.createElement("label", null, "Position"),
    react_1.default.createElement("div", { className: "grid" }, positions.map((position) => (react_1.default.createElement(shared_1.IconButton, { key: position.value, onClick: () => onChange(position.value), primary: value === position.value },
        react_1.default.createElement(shared_1.Icon, { name: position.icon })))))));
exports.default = PositionInput;
//# sourceMappingURL=PositionInput.js.map