"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Giphy_1 = __importDefault(require("./Giphy"));
const GiphySettings_1 = __importDefault(require("./GiphySettings"));
const config = {
    key: "background/giphy",
    name: "GIPHY",
    description: "Hurt your eyes in every new tab.",
    dashboardComponent: Giphy_1.default,
    settingsComponent: GiphySettings_1.default,
    supportsBackdrop: true,
};
exports.default = config;
//# sourceMappingURL=index.js.map