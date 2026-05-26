"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TodoPlus_1 = __importDefault(require("./TodoPlus"));
const TodoSettings_1 = __importDefault(require("../todo/TodoSettings"));
const config = {
    key: "widget/todo",
    name: "Tasks",
    description: "Momentum-style task list.",
    dashboardComponent: TodoPlus_1.default,
    settingsComponent: TodoSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map