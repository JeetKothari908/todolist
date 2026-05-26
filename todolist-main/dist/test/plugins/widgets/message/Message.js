"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const Message = ({ data = types_1.defaultData }) => (react_1.default.createElement("div", { className: "Message" },
    react_1.default.createElement("h3", { style: { whiteSpace: "pre" } }, data.messages[0])));
exports.default = Message;
//# sourceMappingURL=Message.js.map