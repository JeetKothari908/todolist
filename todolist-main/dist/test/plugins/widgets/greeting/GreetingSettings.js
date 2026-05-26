"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const GreetingSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "GreetingSettings" },
    react_1.default.createElement("label", null,
        "Name",
        react_1.default.createElement("input", { type: "text", value: data.name, onChange: (event) => setData({ name: event.target.value }) }))));
exports.default = GreetingSettings;
//# sourceMappingURL=GreetingSettings.js.map