"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const GradientSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "GradientSettings" },
    react_1.default.createElement("label", null,
        "From Colour",
        react_1.default.createElement("input", { type: "color", value: data.from, onChange: (event) => setData(Object.assign(Object.assign({}, data), { from: event.target.value })) })),
    react_1.default.createElement("label", null,
        "To Colour",
        react_1.default.createElement("input", { type: "color", value: data.to, onChange: (event) => setData(Object.assign(Object.assign({}, data), { to: event.target.value })) })),
    react_1.default.createElement("label", null,
        "Angle (0-360)",
        react_1.default.createElement("input", { type: "number", value: data.angle, onChange: (event) => setData(Object.assign(Object.assign({}, data), { angle: Number(event.target.value) })) }))));
exports.default = GradientSettings;
//# sourceMappingURL=GradientSettings.js.map