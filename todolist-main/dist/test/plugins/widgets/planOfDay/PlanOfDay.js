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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const hooks_1 = require("../../../hooks");
const date_1 = require("./date");
const types_1 = require("./types");
require("./PlanOfDay.sass");
const PlanOfDay = ({ data = types_1.defaultData, setData }) => {
    var _a, _b, _c, _d;
    const now = (0, hooks_1.useTime)();
    const activeDate = (0, date_1.getPlanDate)(now);
    const plans = (_a = data.plans) !== null && _a !== void 0 ? _a : {};
    const selectedDate = (_b = data.selectedDate) !== null && _b !== void 0 ? _b : activeDate;
    const plan = (_c = plans[selectedDate]) !== null && _c !== void 0 ? _c : "";
    const [calendarOpen, setCalendarOpen] = (0, react_1.useState)(false);
    const selected = (_d = (0, date_1.parseYmd)(selectedDate)) !== null && _d !== void 0 ? _d : now;
    const [visibleMonth, setVisibleMonth] = (0, react_1.useState)(new Date(selected.getFullYear(), selected.getMonth(), 1));
    (0, react_1.useEffect)(() => {
        setVisibleMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }, [selectedDate]);
    (0, react_1.useEffect)(() => {
        if (data.activeDate === activeDate && data.selectedDate)
            return;
        setData(Object.assign(Object.assign({}, data), { activeDate, selectedDate: !data.selectedDate || data.selectedDate === data.activeDate
                ? activeDate
                : data.selectedDate }));
    }, [activeDate, data, setData]);
    const updatePlan = (contents) => setData(Object.assign(Object.assign({}, data), { activeDate,
        selectedDate, plans: Object.assign(Object.assign({}, plans), { [selectedDate]: contents }) }));
    const selectDate = (date) => {
        if (!date)
            return;
        setData(Object.assign(Object.assign({}, data), { activeDate, selectedDate: date }));
        setCalendarOpen(false);
    };
    const calendarDays = (0, react_1.useMemo)(() => {
        const start = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1 - visibleMonth.getDay());
        return Array.from({ length: 42 }, (_, index) => {
            const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
            return {
                date,
                key: (0, date_1.getYmd)(date),
                inMonth: date.getMonth() === visibleMonth.getMonth(),
            };
        });
    }, [visibleMonth]);
    const moveMonth = (offset) => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1));
    return (react_1.default.createElement("div", { className: "PlanOfDay" },
        react_1.default.createElement("div", { className: "panel" },
            react_1.default.createElement("div", { className: "header" },
                react_1.default.createElement("div", { className: "title" },
                    react_1.default.createElement("span", null, "Plan of the Day "),
                    react_1.default.createElement("div", { className: "date-wrap" },
                        react_1.default.createElement("button", { className: "date-picker", onClick: () => setCalendarOpen(!calendarOpen) }, (0, date_1.formatPlanTitleDate)(selectedDate)),
                        calendarOpen && (react_1.default.createElement("div", { className: "calendar" },
                            react_1.default.createElement("div", { className: "calendar-header" },
                                react_1.default.createElement("button", { onClick: () => moveMonth(-1) }, "<"),
                                react_1.default.createElement("span", null, visibleMonth.toLocaleDateString(undefined, {
                                    month: "short",
                                    year: "numeric",
                                })),
                                react_1.default.createElement("button", { onClick: () => moveMonth(1) }, ">")),
                            react_1.default.createElement("div", { className: "calendar-grid week" }, ["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (react_1.default.createElement("span", { key: `${day}-${index}` }, day)))),
                            react_1.default.createElement("div", { className: "calendar-grid" }, calendarDays.map(({ date, key, inMonth }) => (react_1.default.createElement("button", { key: key, className: `${inMonth ? "" : "muted"}${key === selectedDate ? " selected" : ""}`, onClick: () => selectDate((0, date_1.getYmd)(date)) }, date.getDate()))))))))),
            react_1.default.createElement("textarea", { value: plan, onChange: (event) => updatePlan(event.target.value), spellCheck: true }))));
};
exports.default = PlanOfDay;
//# sourceMappingURL=PlanOfDay.js.map