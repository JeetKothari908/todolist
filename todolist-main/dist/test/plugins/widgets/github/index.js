"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GitHub_1 = __importDefault(require("./GitHub"));
const GitHubSettings_1 = __importDefault(require("./GitHubSettings"));
const config = {
    key: "widget/github",
    name: "GitHub Calendar",
    description: "Get motivated by green squares.",
    dashboardComponent: GitHub_1.default,
    settingsComponent: GitHubSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map