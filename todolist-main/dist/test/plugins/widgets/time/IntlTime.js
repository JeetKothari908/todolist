"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const state_1 = require("../../../db/state");
const react_2 = require("../../../lib/db/react");
/**
 * A react wrapper around `Intl.DateTimeFromat().format()`
 *
 * Todo: Remove this component when react-intl adds the hourCycle option to their component
 *
 *
 * Intl Issue information: https://github.com/formatjs/react-intl/issues/1577
 * Code based on: https://github.com/mattermost/mattermost-webapp/pull/5138
 * Tabliss issue: https://github.com/joelshepherd/tabliss/issues/231
 */
const IntlTime = ({ hour12, showMinutes, showSeconds, showDayPeriod = true, time, }) => {
    const locale = (0, react_2.useValue)(state_1.db, "locale");
    // Time formatter config
    const formater = react_1.default.useMemo(() => Intl.DateTimeFormat(locale, {
        hour: "numeric",
        hourCycle: hour12 ? "h12" : "h23",
        minute: showMinutes ? "numeric" : undefined,
        second: showSeconds ? "numeric" : undefined,
    }), [locale, hour12, showMinutes, showSeconds]);
    if (showDayPeriod) {
        // Return normal time if showing timePeriod
        return react_1.default.createElement(react_1.default.Fragment, null, formater.format(time));
    }
    else {
        // Remove timePeriod from string
        // Returns the date broken down into parts
        return (react_1.default.createElement(react_1.default.Fragment, null, formater
            .formatToParts(time)
            .filter((part) => part.type !== "dayPeriod") // Removes day period from the array
            .map((part) => part.value) // Converts array of objects to array of strings
            .join("")));
    }
};
exports.default = IntlTime;
//# sourceMappingURL=IntlTime.js.map