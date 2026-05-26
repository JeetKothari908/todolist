"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const state_1 = require("../../db/state");
const react_2 = require("../../lib/db/react");
const Backdrop = (_a) => {
    var { children, ready = true, style = {} } = _a, rest = __rest(_a, ["children", "ready", "style"]);
    // Lag one frame behind to show the animation
    const [show, setShow] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        setShow(ready);
    }, [ready]);
    const focus = (0, react_2.useValue)(state_1.db, "focus");
    // TODO: Consider passing display in via prop
    const background = (0, react_2.useValue)(state_1.db, "background");
    const { blur, luminosity = 0 } = background.display;
    style = Object.assign({}, style);
    if (blur && !focus) {
        style["filter"] = `blur(${blur}px)`;
        style["transform"] = `scale(${blur / 500 + 1})`;
    }
    if (luminosity && !focus) {
        style["opacity"] = 1 - Math.abs(luminosity);
    }
    return (react_1.default.createElement("div", { className: "fullscreen", style: {
            opacity: show ? 1 : 0,
            transition: "opacity 150ms ease-in-out",
        } },
        react_1.default.createElement("div", Object.assign({ style: style }, rest), children)));
};
exports.default = Backdrop;
//# sourceMappingURL=Backdrop.js.map