"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Modal_1 = __importDefault(require("./modal/Modal"));
const StoreError = ({ onClose }) => {
    return (react_1.default.createElement(Modal_1.default, { onClose: onClose },
        react_1.default.createElement("div", { className: "Settings" },
            react_1.default.createElement("h2", { style: { margin: 0 } }, "Storage Error"),
            react_1.default.createElement("p", { style: { fontSize: "1.25em" } }, "Tabliss is unable to load or save settings. This is most commonly caused by running in private browsing mode; but low disk space or a corrupt browser profile can also be the problem."),
            react_1.default.createElement("p", null, "If you have settings saved with Tabliss, it might be a temporary issue. Try restarting your browser and checking if your settings return."),
            react_1.default.createElement("p", null,
                "If they do not return, the",
                " ",
                react_1.default.createElement("a", { href: "https://tabliss.io/support.html" }, "support guide"),
                " covers the common causes and how to resolve them. Otherwise, contact",
                " ",
                react_1.default.createElement("a", { href: "mailto:support@tabliss.io" }, "support@tabliss.io"),
                " if you are still unable to solve the issue."),
            react_1.default.createElement("div", { className: "Modal-footer" },
                react_1.default.createElement("a", { className: "button button--primary", href: "https://tabliss.io/support.html", style: { fontSize: "1.1em" }, target: "_blank", rel: "noopener noreferrer" }, "View Support Guide")))));
};
exports.default = StoreError;
//# sourceMappingURL=StoreError.js.map