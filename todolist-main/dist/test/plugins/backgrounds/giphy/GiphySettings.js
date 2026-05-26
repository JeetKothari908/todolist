"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const shared_1 = require("../../shared");
const GiphySettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "GiphySettings" },
    react_1.default.createElement("label", null,
        "Tag",
        react_1.default.createElement(shared_1.DebounceInput, { type: "text", value: data.tag, onChange: (value) => setData(Object.assign(Object.assign({}, data), { tag: value })), wait: 500 })),
    react_1.default.createElement("p", { className: "info" }, "Separate multiple tags with a comma"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: data.expand, onChange: (event) => setData(Object.assign(Object.assign({}, data), { expand: !data.expand })) }),
        " ",
        "Stretch to fill screen"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", checked: !data.nsfw, onChange: (event) => setData(Object.assign(Object.assign({}, data), { nsfw: !data.nsfw })) }),
        " ",
        "Safe Search")));
exports.default = GiphySettings;
//# sourceMappingURL=GiphySettings.js.map