"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Search_1 = __importDefault(require("./Search"));
const SearchSettings_1 = __importDefault(require("./SearchSettings"));
const config = {
    key: "widget/search",
    name: "Search Box",
    description: "Move your URL bar.",
    dashboardComponent: Search_1.default,
    settingsComponent: SearchSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map