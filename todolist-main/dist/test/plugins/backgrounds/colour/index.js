"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Colour_1 = __importDefault(require("./Colour"));
const ColourSettings_1 = __importDefault(require("./ColourSettings"));
const config = {
    key: "background/colour",
    name: "Solid Colour",
    description: "Add a splash of colour.",
    dashboardComponent: Colour_1.default,
    settingsComponent: ColourSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map