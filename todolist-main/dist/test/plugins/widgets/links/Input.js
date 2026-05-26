"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const icons_json_1 = __importDefault(require("feather-icons/dist/icons.json"));
const react_1 = __importDefault(require("react"));
const shared_1 = require("../../../views/shared");
const iconList = Object.keys(icons_json_1.default);
const Input = (props) => (react_1.default.createElement("div", { className: "LinkInput" },
    react_1.default.createElement("h5", null,
        react_1.default.createElement("div", { className: "title--buttons" },
            react_1.default.createElement(shared_1.IconButton, { onClick: props.onRemove, title: "Remove link" },
                react_1.default.createElement(shared_1.RemoveIcon, null)),
            props.onMoveDown && (react_1.default.createElement(shared_1.IconButton, { onClick: props.onMoveDown, title: "Move link down" },
                react_1.default.createElement(shared_1.DownIcon, null))),
            props.onMoveUp && (react_1.default.createElement(shared_1.IconButton, { onClick: props.onMoveUp, title: "Move link up" },
                react_1.default.createElement(shared_1.UpIcon, null)))),
        props.number <= 9 ? `Keyboard shortcut ${props.number}` : "Shortcut"),
    react_1.default.createElement("label", null,
        "URL",
        react_1.default.createElement("input", { type: "url", value: props.url, onChange: (event) => props.onChange({ url: event.target.value }) })),
    react_1.default.createElement("label", null,
        "Name ",
        react_1.default.createElement("span", { className: "text--grey" }, "(optional)"),
        react_1.default.createElement("input", { type: "text", value: props.name, onChange: (event) => props.onChange({ name: event.target.value }) })),
    react_1.default.createElement("label", null,
        "Icon ",
        react_1.default.createElement("span", { className: "text--grey" }, "(optional)"),
        react_1.default.createElement("select", { value: props.icon, onChange: (event) => props.onChange({ icon: event.target.value }) },
            react_1.default.createElement("option", { value: "" }, "None"),
            react_1.default.createElement("option", { value: "_favicon" }, "Website Icon"),
            react_1.default.createElement("optgroup", { label: "Feather Icons" }, iconList.map((key) => (react_1.default.createElement("option", { key: key }, key)))))),
    react_1.default.createElement("hr", null)));
exports.default = Input;
//# sourceMappingURL=Input.js.map