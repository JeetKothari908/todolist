"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const LocationInput_1 = __importDefault(require("./LocationInput"));
const types_1 = require("./types");
const WeatherSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "WeatherSettings" },
    react_1.default.createElement(LocationInput_1.default, { latitude: data.latitude, longitude: data.longitude, onChange: (location) => setData(Object.assign(Object.assign({}, data), location)) }),
    data.latitude && data.latitude ? (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("label", null,
            "Name",
            react_1.default.createElement("input", { type: "text", value: data.name || "", placeholder: "Optional name", onChange: (event) => setData(Object.assign(Object.assign({}, data), { name: event.target.value || undefined })) })),
        react_1.default.createElement("hr", null),
        react_1.default.createElement("label", null,
            react_1.default.createElement("input", { type: "checkbox", checked: data.showDetails, onChange: () => setData(Object.assign(Object.assign({}, data), { showDetails: !data.showDetails })) }),
            " ",
            "Show extended details"),
        react_1.default.createElement("label", null,
            react_1.default.createElement("input", { type: "radio", checked: data.units === "si", onChange: () => setData(Object.assign(Object.assign({}, data), { units: "si" })) }),
            " ",
            "Metric units"),
        react_1.default.createElement("label", null,
            react_1.default.createElement("input", { type: "radio", checked: data.units === "us", onChange: () => setData(Object.assign(Object.assign({}, data), { units: "us" })) }),
            " ",
            "Imperial units"),
        react_1.default.createElement("p", null,
            react_1.default.createElement("a", { href: "https://open-meteo.com/", rel: "noopener noreferrer", target: "_blank" }, "Weather data by Open-Meteo.com")))) : null));
exports.default = WeatherSettings;
//# sourceMappingURL=WeatherSettings.js.map