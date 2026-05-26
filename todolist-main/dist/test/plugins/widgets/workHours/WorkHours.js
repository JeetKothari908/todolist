"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const types_1 = require("./types");
const WorkHours = ({ data = types_1.defaultData }) => {
    let start = buildDateTime(data.startTime);
    const end = buildDateTime(data.endTime);
    const time = (0, hooks_1.useTime)();
    if (start > end) {
        start = (0, date_fns_1.subDays)(start, 1);
    }
    return (react_1.default.createElement("div", { className: "WorkHours" }, isWorkDay(data.days) && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h2", null,
            hoursProgress(time, start, end),
            "%")))));
};
const hoursProgress = (current, start, end) => {
    if (current < start)
        return 0;
    if (current > end)
        return 100;
    const total = end.getTime() - start.getTime();
    const progress = current.getTime() - start.getTime();
    return Math.floor((progress / total) * 100);
};
const buildDateTime = (time) => {
    const [hours, minutes] = time.split(":");
    const dateTime = new Date();
    dateTime.setHours(Number(hours));
    dateTime.setMinutes(Number(minutes));
    dateTime.setSeconds(0);
    return dateTime;
};
const isWorkDay = (days) => days.includes(new Date().getDay());
exports.default = WorkHours;
//# sourceMappingURL=WorkHours.js.map