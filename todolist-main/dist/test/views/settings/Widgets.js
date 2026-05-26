"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const action_1 = require("../../db/action");
const select_1 = require("../../db/select");
const state_1 = require("../../db/state");
const react_2 = require("../../lib/db/react");
const plugins_1 = require("../../plugins");
const Widget_1 = __importDefault(require("./Widget"));
const Widgets = () => {
    const widgets = (0, react_2.useSelector)(state_1.db, select_1.selectWidgets);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null,
            react_1.default.createElement(react_intl_1.FormattedMessage, { id: "widgets", defaultMessage: "Widgets", description: "Widgets title" })),
        react_1.default.createElement("label", null,
            react_1.default.createElement("select", { value: "", onChange: (event) => (0, action_1.addWidget)(event.target.value), className: "primary" },
                react_1.default.createElement("option", { disabled: true, value: "" }, "Add a new widget"),
                plugins_1.widgetConfigs.map((plugin) => (react_1.default.createElement("option", { key: plugin.key, value: plugin.key }, plugin.name))))),
        widgets.map((widget, index) => (react_1.default.createElement(Widget_1.default, { key: widget.id, plugin: widget, onMoveUp: index > 0 ? () => (0, action_1.reorderWidget)(index, index - 1) : undefined, onMoveDown: index < widgets.length - 1
                ? () => (0, action_1.reorderWidget)(index, index + 1)
                : undefined, onRemove: () => (0, action_1.removeWidget)(widget.id) })))));
};
exports.default = Widgets;
//# sourceMappingURL=Widgets.js.map