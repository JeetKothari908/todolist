"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPlanTitleDate = exports.formatPlanDate = exports.getPlanDate = exports.addDays = exports.parseYmd = exports.getYmd = void 0;
const getYmd = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
exports.getYmd = getYmd;
const parseYmd = (value) => {
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};
exports.parseYmd = parseYmd;
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
exports.addDays = addDays;
const getPlanDate = (date) => {
    const reset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8);
    return (0, exports.getYmd)(date < reset ? (0, exports.addDays)(date, -1) : date);
};
exports.getPlanDate = getPlanDate;
const formatPlanDate = (value) => {
    const parsed = (0, exports.parseYmd)(value);
    if (!parsed)
        return value;
    return parsed.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        weekday: "short",
    });
};
exports.formatPlanDate = formatPlanDate;
const formatPlanTitleDate = (value) => {
    const parsed = (0, exports.parseYmd)(value);
    if (!parsed)
        return value;
    return `${parsed.getMonth() + 1}/${parsed.getDate()}`;
};
exports.formatPlanTitleDate = formatPlanTitleDate;
//# sourceMappingURL=date.js.map