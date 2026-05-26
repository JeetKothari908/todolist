"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const MessageSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "MessageSettings" },
    react_1.default.createElement("label", null,
        "Message",
        react_1.default.createElement("textarea", { rows: 3, value: data.messages[0], onChange: (event) => setData({ messages: [event.target.value] }) }))));
exports.default = MessageSettings;
//# sourceMappingURL=MessageSettings.js.map