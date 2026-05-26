"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nba_1 = __importDefault(require("./Nba"));
const NbaSettings_1 = __importDefault(require("./NbaSettings"));
const config = {
    key: "widget/nba",
    name: "NBA Scores",
    description: "Keep up to date with today's NBA games.",
    dashboardComponent: Nba_1.default,
    settingsComponent: NbaSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map