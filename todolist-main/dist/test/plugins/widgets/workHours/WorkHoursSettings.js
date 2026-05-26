"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const daysList = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const WorkHoursSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "WorkHoursSettings" },
    react_1.default.createElement("label", null,
        "Start time",
        react_1.default.createElement("input", { type: "time", value: data.startTime, onChange: (event) => setData(Object.assign(Object.assign({}, data), { startTime: event.target.value })) })),
    react_1.default.createElement("label", null,
        "End time",
        react_1.default.createElement("input", { type: "time", value: data.endTime, onChange: (event) => setData(Object.assign(Object.assign({}, data), { endTime: event.target.value })) })),
    daysList.map((day, index) => (react_1.default.createElement("div", { key: day },
        react_1.default.createElement("label", null,
            react_1.default.createElement("input", { type: "checkbox", checked: data.days.includes(index), onChange: (event) => setData(Object.assign(Object.assign({}, data), { days: event.target.checked
                        ? [...data.days, index]
                        : data.days.filter((day) => day !== index) })) }),
            day))))));
exports.default = WorkHoursSettings;
//# sourceMappingURL=WorkHoursSettings.js.map