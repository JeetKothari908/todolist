"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const shared_1 = require("../../../views/shared");
const api_1 = require("./api");
require("./LocationInput.sass");
const GeocodeInput = ({ onChange }) => {
    const [query, setQuery] = react_1.default.useState("");
    const handleGeocode = (event) => {
        event.preventDefault();
        (0, api_1.geocodeLocation)(query)
            .then((coords) => onChange(Object.assign(Object.assign({}, coords), { name: query })))
            .catch(() => {
            alert("Unable to find location. Please try again.");
        });
    };
    return (react_1.default.createElement("form", { onSubmit: handleGeocode },
        react_1.default.createElement("div", { className: "grid", style: { gridTemplateColumns: "1fr auto" } },
            react_1.default.createElement("label", { htmlFor: "LocationInput__query" }, "Search for city"),
            react_1.default.createElement("div", null),
            react_1.default.createElement("input", { id: "LocationInput__query", placeholder: "City or location", type: "text", value: query, onChange: (event) => setQuery(event.target.value) }),
            react_1.default.createElement("button", { type: "submit", className: "button--primary button--icon" },
                react_1.default.createElement(shared_1.Icon, { name: "search" })))));
};
const geolocationAvailable = "geolocation" in navigator;
const CoordinateInput = ({ latitude, longitude, onChange, }) => {
    const handleLocate = () => {
        (0, api_1.requestLocation)()
            .then(onChange)
            .catch((err) => alert(`Cannot determine your location: ${err.message}`));
    };
    return (react_1.default.createElement("div", { className: "LocationInput" },
        react_1.default.createElement("div", { className: "grid", style: {
                gridTemplateColumns: geolocationAvailable
                    ? "1fr 1fr auto"
                    : "1fr 1fr",
            } },
            react_1.default.createElement("label", { htmlFor: "LocationInput__latitude" }, "Latitude"),
            react_1.default.createElement("label", { htmlFor: "LocationInput__longitude" }, "Longitude"),
            geolocationAvailable && react_1.default.createElement("div", null),
            react_1.default.createElement("input", { id: "LocationInput__latitude", type: "text", value: latitude, onChange: (event) => onChange({ latitude: Number(event.target.value) }) }),
            react_1.default.createElement("input", { id: "LocationInput__longitude", type: "text", value: longitude, onChange: (event) => onChange({ longitude: Number(event.target.value) }) }),
            geolocationAvailable && (react_1.default.createElement("button", { className: "button--primary button--icon", onClick: handleLocate },
                react_1.default.createElement(shared_1.Icon, { name: "navigation" }))))));
};
const LocationInput = (_a) => {
    var { onChange } = _a, props = __rest(_a, ["onChange"]);
    const hasCoordinates = props.longitude && props.latitude;
    const [lookUp, toggleLookUp] = (0, hooks_1.useToggle)(!hasCoordinates);
    const handleChange = (coords) => {
        onChange(coords);
        if (lookUp)
            toggleLookUp();
    };
    return (react_1.default.createElement("div", { className: "LocationInput" },
        lookUp ? (react_1.default.createElement(GeocodeInput, Object.assign({}, props, { onChange: handleChange }))) : (react_1.default.createElement(CoordinateInput, Object.assign({}, props, { onChange: handleChange }))),
        react_1.default.createElement("a", { onClick: toggleLookUp }, lookUp ? "Enter coordinates" : "Search for city")));
};
exports.default = LocationInput;
//# sourceMappingURL=LocationInput.js.map