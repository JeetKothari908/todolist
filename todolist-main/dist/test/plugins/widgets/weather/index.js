"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Weather_1 = __importDefault(require("./Weather"));
const WeatherSettings_1 = __importDefault(require("./WeatherSettings"));
const config = {
    key: "widget/weather",
    name: "Weather",
    description: "Add a window to see outside.",
    dashboardComponent: Weather_1.default,
    settingsComponent: WeatherSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map