"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const action_1 = require("../../db/action");
const hooks_1 = require("../../hooks");
const plugins_1 = require("../../plugins");
const shared_1 = require("../shared");
const Plugin_1 = __importDefault(require("../shared/Plugin"));
const ToggleSection_1 = __importDefault(require("../shared/ToggleSection"));
require("./Widget.sass");
const WidgetDisplay_1 = __importDefault(require("./WidgetDisplay"));
const Widget = ({ plugin, onMoveDown, onMoveUp, onRemove, }) => {
    var _a;
    const [isOpen, toggleIsOpen] = (0, hooks_1.useToggle)(onRemove === undefined);
    const { description, name, settingsComponent } = (0, plugins_1.getConfig)(plugin.key);
    const setDisplay = action_1.setWidgetDisplay.bind(null, plugin.id);
    return (react_1.default.createElement("fieldset", { className: "Widget" },
        react_1.default.createElement("div", { className: "title--buttons" },
            react_1.default.createElement(shared_1.IconButton, { onClick: onRemove, title: "Remove widget" },
                react_1.default.createElement(shared_1.RemoveIcon, null)),
            react_1.default.createElement(shared_1.IconButton, { onClick: toggleIsOpen, title: `${isOpen ? "Close" : "Edit"} widget settings` },
                react_1.default.createElement(shared_1.Icon, { name: "settings" })),
            onMoveDown && (react_1.default.createElement(shared_1.IconButton, { onClick: onMoveDown, title: "Move widget down" },
                react_1.default.createElement(shared_1.DownIcon, null))),
            onMoveUp && (react_1.default.createElement(shared_1.IconButton, { onClick: onMoveUp, title: "Move widget up" },
                react_1.default.createElement(shared_1.UpIcon, null))),
            react_1.default.createElement("h4", { onClick: toggleIsOpen }, name),
            !isOpen && react_1.default.createElement("p", null, description)),
        isOpen && (react_1.default.createElement("div", null,
            settingsComponent && (react_1.default.createElement("div", { className: "settings" },
                react_1.default.createElement(Plugin_1.default, { id: plugin.id, component: settingsComponent }))),
            react_1.default.createElement(ToggleSection_1.default, { name: "Display Settings" },
                react_1.default.createElement(WidgetDisplay_1.default, { display: plugin.display, onChange: setDisplay })),
            react_1.default.createElement(ToggleSection_1.default, { name: "Font Settings" },
                react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("label", null,
                        "Font",
                        react_1.default.createElement("input", { type: "text", value: plugin.display.fontFamily, onChange: (event) => setDisplay({ fontFamily: event.target.value }) })),
                    react_1.default.createElement("label", null,
                        "Weight",
                        react_1.default.createElement("select", { value: plugin.display.fontWeight, onChange: (event) => setDisplay({
                                fontWeight: event.target.value
                                    ? Number(event.target.value)
                                    : undefined,
                            }) },
                            react_1.default.createElement("option", { value: "" }, "Default"),
                            react_1.default.createElement("option", { value: "100" }, "Thin"),
                            react_1.default.createElement("option", { value: "300" }, "Light"),
                            react_1.default.createElement("option", { value: "400" }, "Regular"),
                            react_1.default.createElement("option", { value: "500" }, "Medium"),
                            react_1.default.createElement("option", { value: "700" }, "Bold"),
                            react_1.default.createElement("option", { value: "900" }, "Black"))),
                    react_1.default.createElement("label", null,
                        "Colour",
                        react_1.default.createElement("input", { type: "color", value: (_a = plugin.display.colour) !== null && _a !== void 0 ? _a : "#ffffff", onChange: (event) => setDisplay({ colour: event.target.value }) }))))))));
};
exports.default = Widget;
//# sourceMappingURL=Widget.js.map