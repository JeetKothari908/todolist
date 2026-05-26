"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Css_1 = __importDefault(require("./Css"));
const CssSettings_1 = __importDefault(require("./CssSettings"));
const config = {
    key: "widget/css",
    name: "Custom CSS",
    description: "Make your new tab more style-ish (advanced users).",
    dashboardComponent: Css_1.default,
    settingsComponent: CssSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map