"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Time_1 = __importDefault(require("./Time"));
const TimeSettings_1 = __importDefault(require("./TimeSettings"));
const config = {
    key: "widget/time",
    name: "Time",
    description: "Be on time.",
    dashboardComponent: Time_1.default,
    settingsComponent: TimeSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map