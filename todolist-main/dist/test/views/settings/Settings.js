"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const ui_1 = require("../../contexts/ui");
const action_1 = require("../../db/action");
const select_1 = require("../../db/select");
const state_1 = require("../../db/state");
const hooks_1 = require("../../hooks");
const react_2 = require("../../lib/db/react");
const Background_1 = __importDefault(require("./Background"));
require("./Settings.sass");
const System_1 = __importDefault(require("./System"));
const Settings = () => {
    const { toggleSettings } = react_1.default.useContext(ui_1.UiContext);
    const [showQuotes, setShowQuotes] = (0, react_2.useKey)(state_1.db, "showQuotes");
    const widgets = (0, react_2.useSelector)(state_1.db, select_1.selectWidgets);
    const notesWidget = widgets.find((widget) => widget.key === "widget/notes");
    const planWidget = widgets.find((widget) => widget.key === "widget/planOfDay");
    const toggleWidget = (key, enabled) => {
        const existing = widgets.find((widget) => widget.key === key);
        if (enabled && !existing)
            (0, action_1.addWidget)(key);
        if (!enabled && existing)
            (0, action_1.removeWidget)(existing.id);
    };
    const handleReset = () => {
        if (confirm("Are you sure you want to delete all of your Tabliss settings? This cannot be undone."))
            (0, action_1.resetStore)();
    };
    const handleExport = () => {
        const json = (0, action_1.exportStore)();
        const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = "tabliss.json";
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };
    const handleImport = () => {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.style.display = "none";
        input.type = "file";
        input.addEventListener("change", function () {
            if (this.files) {
                const file = this.files[0];
                const reader = new FileReader();
                reader.addEventListener("load", (event) => {
                    if (event.target && event.target.result) {
                        try {
                            const state = JSON.parse(event.target.result);
                            (0, action_1.importStore)(state);
                        }
                        catch (error) {
                            alert(`Invalid import file: ${error instanceof Error ? error.message : "Uknown error"}`);
                        }
                    }
                });
                reader.readAsText(file);
            }
            document.body.removeChild(input);
        });
        input.click();
    };
    (0, hooks_1.useKeyPress)(toggleSettings, ["Escape"]);
    return (react_1.default.createElement("div", { className: "Settings" },
        react_1.default.createElement("a", { onClick: toggleSettings, className: "fullscreen" }),
        react_1.default.createElement("div", { className: "plane" },
            react_1.default.createElement(Background_1.default, null),
            react_1.default.createElement(System_1.default, null),
            react_1.default.createElement("h2", null, "Widgets"),
            react_1.default.createElement("label", { style: { display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" } },
                react_1.default.createElement("input", { type: "checkbox", checked: showQuotes, onChange: () => setShowQuotes(!showQuotes) }),
                "Quotes"),
            react_1.default.createElement("label", { style: { display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" } },
                react_1.default.createElement("input", { type: "checkbox", checked: !!notesWidget, onChange: (event) => toggleWidget("widget/notes", event.target.checked) }),
                "Notes"),
            react_1.default.createElement("label", { style: { display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" } },
                react_1.default.createElement("input", { type: "checkbox", checked: !!planWidget, onChange: (event) => toggleWidget("widget/planOfDay", event.target.checked) }),
                "Plan of the Day"),
            react_1.default.createElement("p", { style: { marginBottom: "2rem" } },
                react_1.default.createElement("a", { onClick: handleImport }, "Import"),
                ",",
                " ",
                react_1.default.createElement("a", { onClick: handleExport }, "export"),
                " or",
                " ",
                react_1.default.createElement("a", { onClick: handleReset }, "reset"),
                " your settings"),
            react_1.default.createElement(react_intl_1.FormattedMessage, { id: "settings.translationCredits", description: "Give yourself some credit :)", defaultMessage: " ", tagName: "p" }))));
};
exports.default = react_1.default.memo(Settings);
//# sourceMappingURL=Settings.js.map