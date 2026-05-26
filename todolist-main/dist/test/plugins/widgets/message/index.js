"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = __importDefault(require("./Message"));
const MessageSettings_1 = __importDefault(require("./MessageSettings"));
const config = {
    key: "widget/message",
    name: "Message",
    description: "Add your own text.",
    dashboardComponent: Message_1.default,
    settingsComponent: MessageSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map