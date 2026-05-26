"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WorkHours_1 = __importDefault(require("./WorkHours"));
const WorkHoursSettings_1 = __importDefault(require("./WorkHoursSettings"));
const config = {
    key: "widget/workHours",
    name: "Work Hours",
    description: "Count down the working hours.",
    dashboardComponent: WorkHours_1.default,
    settingsComponent: WorkHoursSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map