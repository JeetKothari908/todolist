"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Todo_1 = __importDefault(require("./Todo"));
const TodoSettings_1 = __importDefault(require("./TodoSettings"));
const config = {
    key: "widget/todo",
    name: "Todos",
    description: "Add reminders to procrastinate.",
    dashboardComponent: Todo_1.default,
    settingsComponent: TodoSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map