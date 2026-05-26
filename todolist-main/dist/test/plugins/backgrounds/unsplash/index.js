"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Unsplash_1 = __importDefault(require("./Unsplash"));
const UnsplashSettings_1 = __importDefault(require("./UnsplashSettings"));
const config = {
    key: "background/unsplash",
    name: "Unsplash",
    description: "Who has time to find their own images.",
    dashboardComponent: Unsplash_1.default,
    settingsComponent: UnsplashSettings_1.default,
    supportsBackdrop: true,
};
exports.default = config;
//# sourceMappingURL=index.js.map