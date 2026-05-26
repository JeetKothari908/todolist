"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LiteratureClock_1 = __importDefault(require("./LiteratureClock"));
const LiteratureClockSettings_1 = __importDefault(require("./LiteratureClockSettings"));
const config = {
    key: "widget/literature-clock",
    name: "Literature Clock",
    description: "Check the time, with sophistication.",
    dashboardComponent: LiteratureClock_1.default,
    settingsComponent: LiteratureClockSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map