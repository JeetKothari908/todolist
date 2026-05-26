"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Links_1 = __importDefault(require("./Links"));
const LinksSettings_1 = __importDefault(require("./LinksSettings"));
const config = {
    key: "widget/links",
    name: "Quick Links",
    description: "I heard you like bookmarks.",
    dashboardComponent: Links_1.default,
    settingsComponent: LinksSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map