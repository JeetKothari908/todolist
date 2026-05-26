"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wallpapers_1 = __importDefault(require("./Wallpapers"));
const config = {
    key: "background/wallpapers",
    name: "Wallpapers",
    description: "Local wallpaper set.",
    dashboardComponent: Wallpapers_1.default,
    supportsBackdrop: true,
};
exports.default = config;
//# sourceMappingURL=index.js.map