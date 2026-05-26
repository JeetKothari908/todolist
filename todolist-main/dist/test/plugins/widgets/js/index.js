"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Js_1 = __importDefault(require("./Js"));
const JsSettings_1 = __importDefault(require("./JsSettings"));
const config = {
    key: "widget/js",
    name: "Custom JS",
    description: "Program in your program.",
    dashboardComponent: Js_1.default,
    settingsComponent: JsSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map