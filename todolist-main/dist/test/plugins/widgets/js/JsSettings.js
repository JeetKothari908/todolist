"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const types_1 = require("./types");
const JsSettings = ({ data = types_1.defaultData, setData }) => {
    const [input, setInput] = (0, react_1.useState)(data.input);
    const handleSave = () => setData({ input });
    return (react_1.default.createElement("div", { className: "JsSettings" },
        react_1.default.createElement("label", null,
            "JavaScript Snippet",
            react_1.default.createElement("textarea", { rows: 3, style: { fontFamily: "monospace" }, value: input, onChange: (event) => setInput(event.target.value) })),
        react_1.default.createElement("button", { onClick: handleSave }, "Apply"),
        react_1.default.createElement("p", { className: "info" }, "Warning: this functionality is intended for advanced users. Custom scripts may break at any time. The snippet will run once after the dashboard has loaded. Be careful of persisting event listeners when editing the snippet.")));
};
exports.default = JsSettings;
//# sourceMappingURL=JsSettings.js.map