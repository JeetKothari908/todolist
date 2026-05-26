"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Image_1 = __importDefault(require("./Image"));
const ImageSettings_1 = __importDefault(require("./ImageSettings"));
const config = {
    key: "background/image",
    name: "Upload Images",
    description: "See your own images.",
    dashboardComponent: Image_1.default,
    settingsComponent: ImageSettings_1.default,
    supportsBackdrop: true,
};
exports.default = config;
//# sourceMappingURL=index.js.map