"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const state_1 = require("../../db/state");
const react_2 = require("../../lib/db/react");
const action_1 = require("../../db/action");
const plugins_1 = require("../../plugins");
const Plugin_1 = __importDefault(require("../shared/Plugin"));
const Background = () => {
    const background = (0, react_2.useValue)(state_1.db, "background");
    const config = (0, plugins_1.getConfigSafe)(background.key);
    react_1.default.useEffect(() => {
        if (!config) {
            (0, action_1.setBackground)("background/wallpapers");
        }
    }, [config]);
    if (!config)
        return null;
    return (react_1.default.createElement("div", { className: "Background" },
        react_1.default.createElement(Plugin_1.default, { id: background.id, component: config.dashboardComponent })));
};
exports.default = Background;
//# sourceMappingURL=Background.js.map