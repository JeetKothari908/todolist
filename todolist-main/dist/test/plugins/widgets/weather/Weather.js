"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const hooks_1 = require("../../../hooks");
const utils_1 = require("../../../utils");
const shared_1 = require("../../../views/shared");
const api_1 = require("./api");
const conditions_1 = require("./conditions");
const types_1 = require("./types");
require("./Weather.sass");
const Weather = ({ cache, data = types_1.defaultData, loader, setCache, setData, }) => {
    const time = (0, hooks_1.useTime)("absolute");
    const translated = (0, hooks_1.useFormatMessages)(messages);
    // Cache weather data for 6 hours
    (0, hooks_1.useCachedEffect)(() => {
        (0, api_1.getForecast)(data, loader).then(setCache);
    }, cache ? cache.timestamp + 6 * utils_1.HOURS : 0, [data.latitude, data.latitude, data.units]);
    const conditions = cache && cache.conditions
        ? (0, conditions_1.findCurrent)(cache.conditions, time.getTime())
        : null;
    // Blank or loading state
    if (!conditions)
        return react_1.default.createElement("div", { className: "Weather" }, "-");
    return (react_1.default.createElement("div", { className: "Weather" },
        react_1.default.createElement("div", { className: "summary", onClick: () => setData(Object.assign(Object.assign({}, data), { showDetails: !data.showDetails })), title: "Toggle weather details" },
            data.name ? react_1.default.createElement("span", null, data.name) : null,
            react_1.default.createElement(shared_1.Icon, { name: conditions_1.weatherCodes[conditions.weatherCode] }),
            react_1.default.createElement("span", { className: "temperature" },
                Math.round(conditions.temperature),
                "\u02DA")),
        data.showDetails ? (react_1.default.createElement("div", { className: "details" },
            react_1.default.createElement("dl", null,
                react_1.default.createElement("dt", null,
                    Math.round(conditions.apparentTemperature),
                    "\u02DA"),
                react_1.default.createElement("dd", null, translated.apparent)),
            react_1.default.createElement("dl", null,
                react_1.default.createElement("dt", null,
                    conditions.humidity,
                    "%"),
                react_1.default.createElement("dd", null, translated.humidity)))) : null));
};
// Translation messages
const messages = (0, react_intl_1.defineMessages)({
    high: {
        id: "plugins.weather.high",
        description: "High for temperature high",
        defaultMessage: "High",
    },
    low: {
        id: "plugins.weather.low",
        description: "Low for temperature low",
        defaultMessage: "Low",
    },
    apparent: {
        id: "plugins.weather.apparent",
        description: "Apparent/Feels like tempurature",
        defaultMessage: "Feels like",
    },
    humidity: {
        id: "plugins.weather.humidity",
        description: "Humidity",
        defaultMessage: "Humidity",
    },
});
exports.default = Weather;
//# sourceMappingURL=Weather.js.map