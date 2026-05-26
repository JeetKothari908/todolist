"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.widgetConfigs = void 0;
const css_1 = __importDefault(require("./css"));
const greeting_1 = __importDefault(require("./greeting"));
const js_1 = __importDefault(require("./js"));
const links_1 = __importDefault(require("./links"));
const message_1 = __importDefault(require("./message"));
const notes_1 = __importDefault(require("./notes"));
const planOfDay_1 = __importDefault(require("./planOfDay"));
const quote_1 = __importDefault(require("./quote"));
const search_1 = __importDefault(require("./search"));
const time_1 = __importDefault(require("./time"));
const todo_plus_1 = __importDefault(require("./todo-plus"));
const workHours_1 = __importDefault(require("./workHours"));
exports.widgetConfigs = [
    css_1.default,
    greeting_1.default,
    links_1.default,
    message_1.default,
    notes_1.default,
    planOfDay_1.default,
    time_1.default,
    search_1.default,
    quote_1.default,
    todo_plus_1.default,
    workHours_1.default,
];
if (BUILD_TARGET === "web") {
    exports.widgetConfigs.push(js_1.default);
}
//# sourceMappingURL=index.js.map