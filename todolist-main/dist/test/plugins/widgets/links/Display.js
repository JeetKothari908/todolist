"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_intl_1 = require("react-intl");
const shared_1 = require("../../../views/shared");
const displayUrl = (url) => {
    try {
        const parsed = new URL(url);
        return parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
    }
    catch (e) {
        return url;
    }
};
const messages = (0, react_intl_1.defineMessages)({
    shortcutHint: {
        id: "plugins.links.shortcutHint",
        description: "Hover hint text for links with a keyboard shortcut",
        defaultMessage: "Press {number} or click to visit",
    },
    standardHint: {
        id: "plugins.links.standardHint",
        description: "Hover hint text for links without a keyboard shortcut",
        defaultMessage: "Click to visit",
    },
});
const Display = ({ icon, name, number, url, linkOpenStyle }) => {
    const intl = (0, react_intl_1.useIntl)();
    const title = (0, react_1.useMemo)(() => number < 10
        ? intl.formatMessage(messages.shortcutHint, { number })
        : intl.formatMessage(messages.standardHint), [intl, number]);
    return (react_1.default.createElement("a", { href: url, rel: "noopener noreferrer", target: linkOpenStyle ? "_blank" : "_self", title: title },
        icon === "_favicon" ? null : icon ? react_1.default.createElement(shared_1.Icon, { name: icon }) : null,
        icon && name && " ",
        react_1.default.createElement("span", { className: "LinkText" },
            name,
            !name && !icon && displayUrl(url))));
};
exports.default = Display;
//# sourceMappingURL=Display.js.map