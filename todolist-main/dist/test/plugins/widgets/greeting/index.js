"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Greeting_1 = __importDefault(require("./Greeting"));
const GreetingSettings_1 = __importDefault(require("./GreetingSettings"));
const config = {
    key: "widget/greeting",
    name: "Greeting",
    description: "Be personally greeted all day.",
    dashboardComponent: Greeting_1.default,
    settingsComponent: GreetingSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map