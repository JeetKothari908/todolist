"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const shared_1 = require("../../../views/shared");
const shared_2 = require("../../shared");
const topics_json_1 = __importDefault(require("./topics.json"));
const types_1 = require("./types");
const UnsplashSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "UnsplashSettings" },
    react_1.default.createElement("label", null,
        react_1.default.createElement("span", { style: { float: "right" } },
            data.paused ? react_1.default.createElement("span", { className: "text--grey" }, "(Paused) ") : null,
            react_1.default.createElement("a", { onClick: () => setData(Object.assign(Object.assign({}, data), { paused: !data.paused })) },
                react_1.default.createElement(shared_1.Icon, { name: data.paused ? "play" : "pause" }))),
        "Show a new photo",
        react_1.default.createElement("select", { value: data.timeout, onChange: (event) => setData(Object.assign(Object.assign({}, data), { timeout: Number(event.target.value) })) },
            react_1.default.createElement("option", { value: "0" }, "Every new tab"),
            react_1.default.createElement("option", { value: "300" }, "Every 5 minutes"),
            react_1.default.createElement("option", { value: "900" }, "Every 15 minutes"),
            react_1.default.createElement("option", { value: "3600" }, "Every hour"),
            react_1.default.createElement("option", { value: "86400" }, "Every day"),
            react_1.default.createElement("option", { value: "604800" }, "Every week"))),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "radio", checked: data.by === "official", onChange: () => setData(Object.assign(Object.assign({}, data), { by: "official" })) }),
        " ",
        "Official Collection"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "radio", checked: data.by === "topics", onChange: () => setData(Object.assign(Object.assign({}, data), { by: "topics" })) }),
        " ",
        "Topic"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "radio", checked: data.by === "search", onChange: () => setData(Object.assign(Object.assign({}, data), { by: "search" })) }),
        " ",
        "Search"),
    react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "radio", checked: data.by === "collections", onChange: () => setData(Object.assign(Object.assign({}, data), { by: "collections" })) }),
        " ",
        "Collection"),
    data.by === "topics" && (react_1.default.createElement("label", null,
        "Topic",
        react_1.default.createElement("select", { value: data.topics, onChange: (event) => setData(Object.assign(Object.assign({}, data), { topics: event.target.value })) }, topics_json_1.default.map((topic) => (react_1.default.createElement("option", { key: topic.id, value: topic.id }, topic.title)))))),
    data.by === "search" && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("label", null,
            "Tags",
            react_1.default.createElement(shared_2.DebounceInput, { type: "text", value: data.search, placeholder: "Try landscapes or animals...", onChange: (value) => setData(Object.assign(Object.assign({}, data), { search: value })), wait: 500 })),
        react_1.default.createElement("label", null,
            react_1.default.createElement("input", { type: "checkbox", checked: data.featured, onChange: (event) => setData(Object.assign(Object.assign({}, data), { featured: !data.featured })) }),
            " ",
            "Only featured images"))),
    data.by === "collections" && (react_1.default.createElement("label", null,
        "Collection",
        react_1.default.createElement(shared_2.DebounceInput, { type: "text", value: data.collections, placeholder: "Collection ID number", onChange: (value) => setData(Object.assign(Object.assign({}, data), { collections: value })), wait: 500 })))));
exports.default = UnsplashSettings;
//# sourceMappingURL=UnsplashSettings.js.map