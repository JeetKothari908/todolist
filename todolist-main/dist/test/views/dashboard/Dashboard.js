"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const state_1 = require("../../db/state");
const react_2 = require("../../lib/db/react");
const Background_1 = __importDefault(require("./Background"));
require("./Dashboard.sass");
const Overlay_1 = __importDefault(require("./Overlay"));
const Widgets_1 = __importDefault(require("./Widgets"));
const Dashboard = () => {
    var _a;
    const background = (0, react_2.useValue)(state_1.db, "background");
    const theme = ((_a = background.display.luminosity) !== null && _a !== void 0 ? _a : 0) > 0 ? "light" : "dark";
    // Set init theme for pre settings load (see `target/<target>/index.html`)
    react_1.default.useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);
    return (react_1.default.createElement("div", { className: `Dashboard fullscreen ${theme}` },
        react_1.default.createElement(Background_1.default, null),
        DEV && BUILD_TARGET !== "web" && (react_1.default.createElement("div", { className: "DevBadge" }, "Extension active")),
        react_1.default.createElement(Widgets_1.default, null),
        react_1.default.createElement(Overlay_1.default, null)));
};
exports.default = react_1.default.memo(Dashboard);
//# sourceMappingURL=Dashboard.js.map