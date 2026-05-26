"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const action_1 = require("../../db/action");
const plugins_1 = require("../../plugins");
const Plugin_1 = __importDefault(require("../shared/Plugin"));
require("./Slot.sass");
const Widget_1 = __importDefault(require("./Widget"));
const Slot = ({ position, widgets }) => {
    const invalidIds = widgets
        .filter((widget) => !(0, plugins_1.getConfigSafe)(widget.key))
        .map((widget) => widget.id);
    react_1.default.useEffect(() => {
        invalidIds.forEach((id) => (0, action_1.removeWidget)(id));
    }, [invalidIds.join(",")]);
    const priority = (key) => {
        if (position === "middleCentre") {
            if (key === "widget/time")
                return 0;
            if (key === "widget/search")
                return 1;
        }
        return 2;
    };
    const orderedWidgets = [...widgets].sort((a, b) => {
        const pa = priority(a.key);
        const pb = priority(b.key);
        if (pa !== pb)
            return pa - pb;
        return a.order - b.order;
    });
    return (react_1.default.createElement("div", { className: `Slot ${position}` }, orderedWidgets.map(({ display, id, key }) => {
        const config = (0, plugins_1.getConfigSafe)(key);
        if (!config)
            return null;
        return (react_1.default.createElement(Widget_1.default, Object.assign({ key: id }, display),
            react_1.default.createElement(Plugin_1.default, { id: id, component: config.dashboardComponent })));
    })));
};
exports.default = Slot;
//# sourceMappingURL=Slot.js.map