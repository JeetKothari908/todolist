"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const hooks_1 = require("../../../hooks");
const Analogue_1 = __importDefault(require("./Analogue"));
const Digital_1 = __importDefault(require("./Digital"));
const types_1 = require("./types");
require("./Time.sass");
const date_fns_tz_1 = require("date-fns-tz");
const Time = ({ data = types_1.defaultData }) => {
    const { hour12, mode, name, showDate, showMinutes, showSeconds, timeZone, showDayPeriod = true, } = data;
    let time = (0, hooks_1.useTime)(timeZone ? "absolute" : "zoned");
    if (timeZone) {
        time = (0, date_fns_tz_1.utcToZonedTime)(time, timeZone);
    }
    return (react_1.default.createElement("div", { className: "Time" },
        mode === "analogue" ? (react_1.default.createElement(Analogue_1.default, { time: time, showMinutes: showMinutes, showSeconds: showSeconds })) : (react_1.default.createElement(Digital_1.default, { time: time, hour12: hour12, showMinutes: showMinutes, showSeconds: showSeconds, showDayPeriod: showDayPeriod })),
        name && react_1.default.createElement("h2", null, name),
        showDate && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("hr", null),
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_intl_1.FormattedDate, { value: time, day: "numeric", month: "long", weekday: "long" }))))));
};
exports.default = Time;
//# sourceMappingURL=Time.js.map