"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Gradient_1 = __importDefault(require("./Gradient"));
const GradientSettings_1 = __importDefault(require("./GradientSettings"));
const config = {
    key: "background/gradient",
    name: "Colour Gradient",
    description: "Add more splashes of colour.",
    dashboardComponent: Gradient_1.default,
    settingsComponent: GradientSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map