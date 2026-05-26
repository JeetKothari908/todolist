"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const IpInfoSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "IpInfoSettings" },
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.displayCity, onChange: () => setData(Object.assign(Object.assign({}, data), { displayCity: !data.displayCity })) }),
        "Display City"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.displayCountry, onChange: () => setData(Object.assign(Object.assign({}, data), { displayCountry: !data.displayCountry })) }),
        "Display Country")));
exports.default = IpInfoSettings;
//# sourceMappingURL=IpInfoSettings.js.map