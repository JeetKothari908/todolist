"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const engines_1 = require("./engines");
const types_1 = require("./types");
const SearchSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "SearchSettings" },
    react_1.default.createElement("label", null,
        "Search Provider",
        react_1.default.createElement("select", { onChange: (event) => setData(Object.assign(Object.assign({}, data), { searchEngine: event.target.value })), value: data.searchEngine }, engines_1.engines.map(({ key, name }) => (react_1.default.createElement("option", { key: key, value: key }, name))))),
    BUILD_TARGET === "web" && (react_1.default.createElement("label", null,
        "Suggestions Provider",
        react_1.default.createElement("select", { onChange: (event) => setData(Object.assign(Object.assign({}, data), { suggestionsEngine: event.target.value })), value: data.suggestionsEngine },
            react_1.default.createElement("option", { key: "off", value: "" }, "Off"),
            engines_1.engines
                .filter(({ suggest_url }) => Boolean(suggest_url))
                .map(({ key, name }) => (react_1.default.createElement("option", { key: key, value: key }, name)))))),
    data.suggestionsEngine && (react_1.default.createElement("label", null,
        "Suggestion Quanitity",
        react_1.default.createElement("input", { type: "number", min: "1", max: "10", value: data.suggestionsQuantity, onChange: (event) => setData(Object.assign(Object.assign({}, data), { suggestionsQuantity: Number(event.target.value) })) })))));
exports.default = SearchSettings;
//# sourceMappingURL=SearchSettings.js.map