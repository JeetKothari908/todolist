"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const error_1 = require("../../contexts/error");
const ui_1 = require("../../contexts/ui");
const hooks_1 = require("../../hooks");
const shared_1 = require("../shared");
require("./Overlay.sass");
const messages = (0, react_intl_1.defineMessages)({
    settingsHint: {
        id: "dashboard.settingsHint",
        defaultMessage: "Customise Tabliss",
        description: "Hover hint text for the settings icon",
    },
    loadingHint: {
        id: "dashboard.loadingHint",
        defaultMessage: "Loading new content",
        description: "Hover hint text for the loading indicator icon (the lightning bolt)",
    },
    errorHint: {
        id: "dashboard.errorHint",
        defaultMessage: "Show errors",
        description: "Hover hint text for the error indicator icon",
    },
});
const Overlay = () => {
    const translated = (0, hooks_1.useFormatMessages)(messages);
    const { errors } = react_1.default.useContext(error_1.ErrorContext);
    const { pending, toggleErrors, toggleSettings } = react_1.default.useContext(ui_1.UiContext);
    (0, hooks_1.useKeyPress)(toggleSettings, ["s"]);
    return (react_1.default.createElement("div", { className: "Overlay" },
        react_1.default.createElement("a", { onClick: toggleSettings, title: `${translated.settingsHint} (S)` },
            react_1.default.createElement(shared_1.Icon, { name: "settings" })),
        errors.length > 0 ? (react_1.default.createElement("a", { onClick: toggleErrors, title: translated.errorHint },
            react_1.default.createElement(shared_1.Icon, { name: "alert-triangle" }))) : null,
        pending > 0 ? (react_1.default.createElement("span", { title: translated.loadingHint },
            react_1.default.createElement(shared_1.Icon, { name: "zap" }))) : null));
};
exports.default = Overlay;
//# sourceMappingURL=Overlay.js.map