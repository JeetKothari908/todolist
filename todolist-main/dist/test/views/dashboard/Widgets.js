"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const select_1 = require("../../db/select");
const state_1 = require("../../db/state");
const react_2 = require("../../lib/db/react");
const Slot_1 = __importDefault(require("./Slot"));
require("./Widgets.sass");
/** Returns true when the browser window is maximized or in F11 fullscreen. */
function useIsWindowMaximized() {
    const check = () => {
        // F11 fullscreen
        if (document.fullscreenElement)
            return true;
        // On Windows, a maximized window's outerWidth/outerHeight match or
        // slightly exceed screen.availWidth/availHeight (invisible borders).
        // Use a tolerance to account for that.
        const tolerance = 30;
        return (window.outerWidth >= screen.availWidth - tolerance &&
            window.outerHeight >= screen.availHeight - tolerance);
    };
    const [maximized, setMaximized] = (0, react_1.useState)(check);
    (0, react_1.useEffect)(() => {
        const update = () => setMaximized(check());
        window.addEventListener("resize", update);
        document.addEventListener("fullscreenchange", update);
        return () => {
            window.removeEventListener("resize", update);
            document.removeEventListener("fullscreenchange", update);
        };
    }, []);
    return maximized;
}
const Widgets = () => {
    const focus = (0, react_2.useValue)(state_1.db, "focus");
    const showQuotes = (0, react_2.useValue)(state_1.db, "showQuotes");
    const isFullscreen = useIsWindowMaximized();
    const allWidgets = (0, react_2.useSelector)(state_1.db, select_1.selectWidgets);
    // Only show the todo widget when the window is fullscreen / maximized
    // Hide quotes widget when showQuotes is false
    const widgets = allWidgets.filter((widget) => (widget.key !== "widget/todo" || isFullscreen) &&
        (widget.key !== "widget/quote" || showQuotes));
    // TODO: one day we'll have `Array.groupBy` accepted by tc39
    const grouped = widgets.reduce((carry, widget) => {
        var _a;
        return (Object.assign(Object.assign({}, carry), { [widget.display.position]: [
                ...((_a = carry[widget.display.position]) !== null && _a !== void 0 ? _a : []),
                widget,
            ] }));
    }, {});
    const slots = Object.entries(grouped);
    return (react_1.default.createElement("div", { className: "Widgets fullscreen" },
        react_1.default.createElement("div", { className: "container" }, !focus &&
            slots.map(([position, widgets]) => (react_1.default.createElement(Slot_1.default, { key: position, position: position, widgets: widgets }))))));
};
exports.default = Widgets;
//# sourceMappingURL=Widgets.js.map