"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const action_1 = require("../../db/action");
const state_1 = require("../../db/state");
const react_2 = require("../../lib/db/react");
const plugins_1 = require("../../plugins");
const Plugin_1 = __importDefault(require("../shared/Plugin"));
const ToggleSection_1 = __importDefault(require("../shared/ToggleSection"));
const Background = () => {
    const [data, setData] = (0, react_2.useKey)(state_1.db, "background");
    const plugin = (0, plugins_1.getConfig)(data.key);
    const setBackgroundDisplay = (display) => {
        setData(Object.assign(Object.assign({}, data), { display: Object.assign(Object.assign({}, data.display), display) }));
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null,
            react_1.default.createElement(react_intl_1.FormattedMessage, { id: "background", defaultMessage: "Background", description: "Background title" })),
        react_1.default.createElement("label", null,
            react_1.default.createElement("select", { value: data.key, onChange: (event) => (0, action_1.setBackground)(event.target.value), className: "primary" }, plugins_1.backgroundConfigs.map((plugin) => (react_1.default.createElement("option", { key: plugin.key, value: plugin.key }, plugin.name))))),
        plugin && (react_1.default.createElement("div", { className: "Widget" },
            react_1.default.createElement("h4", null, plugin.name),
            plugin.settingsComponent && (react_1.default.createElement("div", { className: "settings" },
                react_1.default.createElement(Plugin_1.default, { id: data.id, component: plugin.settingsComponent }))),
            plugin.supportsBackdrop && (react_1.default.createElement(ToggleSection_1.default, { name: "Display Settings" },
                react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("label", null,
                        "Blur ",
                        react_1.default.createElement("br", null),
                        react_1.default.createElement("input", { type: "range", list: "blur-markers", min: "0", max: "50", step: "2", value: data.display.blur, onChange: (event) => setBackgroundDisplay({
                                blur: Number(event.target.value),
                            }) }),
                        react_1.default.createElement("datalist", { id: "blur-markers" },
                            react_1.default.createElement("option", { value: "0" }),
                            react_1.default.createElement("option", { value: "50" }))),
                    react_1.default.createElement("label", null,
                        "Luminosity ",
                        react_1.default.createElement("br", null),
                        react_1.default.createElement("input", { type: "range", list: "luminosity-markers", min: "-1", max: "1", step: "0.1", value: data.display.luminosity, onChange: (event) => setBackgroundDisplay({
                                luminosity: Number(event.target.value),
                            }) }),
                        react_1.default.createElement("datalist", { id: "luminosity-markers" },
                            react_1.default.createElement("option", { value: "-1", label: "Darken" }),
                            react_1.default.createElement("option", { value: "0" }),
                            react_1.default.createElement("option", { value: "1", label: "Lighten" }))))))))));
};
exports.default = Background;
//# sourceMappingURL=Background.js.map