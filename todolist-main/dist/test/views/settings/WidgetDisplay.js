"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const PositionInput_1 = __importDefault(require("./PositionInput"));
require("./WidgetDisplay.css");
const WidgetDisplay = ({ display, onChange }) => {
    return (react_1.default.createElement("div", { className: "WidgetDisplay" },
        react_1.default.createElement(PositionInput_1.default, { value: display.position, onChange: (position) => onChange({ position }) }),
        react_1.default.createElement("label", null,
            "Size",
            react_1.default.createElement("br", null),
            react_1.default.createElement("input", { type: "range", value: display.fontSize, min: "2", max: "100", step: "2", onChange: (event) => onChange({ fontSize: Number(event.target.value) }) }))));
};
exports.default = WidgetDisplay;
//# sourceMappingURL=WidgetDisplay.js.map