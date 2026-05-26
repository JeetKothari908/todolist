"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Analogue.sass");
const Analogue = ({ time, showMinutes, showSeconds }) => {
    const hoursAngle = time.getHours() * 30 + time.getMinutes() * 0.5;
    const minutesAngle = time.getHours() * 360 + time.getMinutes() * 6;
    const secondsAngle = time.getHours() * 360 + time.getMinutes() * 360 + time.getSeconds() * 6;
    return (react_1.default.createElement("div", { className: "Time Analogue" },
        react_1.default.createElement("svg", { viewBox: "0 0 100 100" },
            react_1.default.createElement("circle", { cx: "50", cy: "50", r: "45", className: "bezel theme-stroke" }),
            react_1.default.createElement("line", { x1: "50", y1: "50", x2: "50", y2: "30", className: "hours theme-stroke", style: { transform: `rotate(${hoursAngle}deg)` } }),
            showMinutes && (react_1.default.createElement("line", { x1: "50", y1: "50", x2: "50", y2: "15", className: "minutes theme-stroke", style: { transform: `rotate(${minutesAngle}deg)` } })),
            showSeconds && (react_1.default.createElement("line", { x1: "50", y1: "50", x2: "50", y2: "10", className: "seconds theme-stroke", style: { transform: `rotate(${secondsAngle}deg)` } })),
            react_1.default.createElement("circle", { cx: "50", cy: "50", r: "3", className: "cap theme-fill" }))));
};
exports.default = Analogue;
//# sourceMappingURL=Analogue.js.map