"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const TimeZoneInput_1 = __importDefault(require("../../../views/shared/timeZone/TimeZoneInput"));
const TimeSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "TimeSettings" },
    react_1.default.createElement("label", null,
        "Name",
        react_1.default.createElement("input", { type: "text", value: data.name, placeholder: "Optional name", onChange: (event) => setData(Object.assign(Object.assign({}, data), { name: event.target.value })) })),
    react_1.default.createElement("label", null,
        "Time Zone",
        react_1.default.createElement(TimeZoneInput_1.default, { timeZone: data.timeZone, onChange: (timeZone) => setData(Object.assign(Object.assign({}, data), { timeZone })) })),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "radio", checked: data.mode === "analogue", onChange: () => setData(Object.assign(Object.assign({}, data), { mode: "analogue" })) }),
        " ",
        "Analogue"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "radio", checked: data.mode === "digital" && data.hour12, onChange: () => setData(Object.assign(Object.assign({}, data), { mode: "digital", hour12: true })) }),
        " ",
        "12-hour digital"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "radio", checked: data.mode === "digital" && !data.hour12, onChange: () => setData(Object.assign(Object.assign({}, data), { mode: "digital", hour12: false })) }),
        " ",
        "24-hour digital"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.showSeconds, onChange: () => setData(Object.assign(Object.assign({}, data), { showSeconds: !data.showSeconds })) }),
        " ",
        "Display seconds"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.showMinutes, onChange: () => setData(Object.assign(Object.assign({}, data), { showMinutes: !data.showMinutes })) }),
        " ",
        "Display minutes"),
    data.mode === "digital" && data.hour12 && (react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.showDayPeriod, onChange: () => setData(Object.assign(Object.assign({}, data), { showDayPeriod: !data.showDayPeriod })) }),
        " ",
        "Display day period")),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.showDate, onChange: () => setData(Object.assign(Object.assign({}, data), { showDate: !data.showDate })) }),
        " ",
        "Display date")));
exports.default = TimeSettings;
//# sourceMappingURL=TimeSettings.js.map