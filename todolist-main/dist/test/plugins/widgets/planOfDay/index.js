"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlanOfDay_1 = __importDefault(require("./PlanOfDay"));
const config = {
    key: "widget/planOfDay",
    name: "Plan of the Day",
    description: "Write the plan for today.",
    dashboardComponent: PlanOfDay_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map