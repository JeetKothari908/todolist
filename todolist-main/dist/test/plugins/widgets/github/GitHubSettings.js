"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const shared_1 = require("../../shared");
const types_1 = require("./types");
const GitHubSettings = ({ data = types_1.defaultData, setData }) => (react_1.default.createElement("div", { className: "MessageSettings" },
    react_1.default.createElement("label", null,
        "GitHub Username",
        react_1.default.createElement(shared_1.DebounceInput, { type: "text", value: data.username, onChange: (username) => setData(Object.assign(Object.assign({}, data), { username })) }))));
exports.default = GitHubSettings;
//# sourceMappingURL=GitHubSettings.js.map