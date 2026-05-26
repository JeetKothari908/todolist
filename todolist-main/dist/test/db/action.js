"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetStore = exports.exportStore = exports.importStore = exports.toggleFocus = exports.setWidgetDisplay = exports.reorderWidget = exports.removeWidget = exports.addWidget = exports.setBackground = exports.createId = void 0;
const nanoid_1 = require("nanoid");
const lib_1 = require("../lib");
const migrate2_1 = __importDefault(require("./migrations/migrate2"));
const select_1 = require("./select");
const state_1 = require("./state");
const createId = () => (0, nanoid_1.nanoid)(12);
exports.createId = createId;
// Background actions
/** Change the background */
const setBackground = (key) => {
    const current = lib_1.DB.get(state_1.db, "background");
    const id = (0, exports.createId)();
    lib_1.DB.put(state_1.db, "background", {
        id,
        key,
        display: { blur: 0, luminosity: -0.2 },
    });
    lib_1.DB.del(state_1.db, `data/${current.id}`);
    lib_1.DB.del(state_1.cache, current.id);
};
exports.setBackground = setBackground;
// Widget actions
/** Add a new widget */
const addWidget = (key) => {
    var _a;
    removeMutuallyExclusiveWidgets(key);
    const id = (_a = singletonWidgetId(key)) !== null && _a !== void 0 ? _a : (0, exports.createId)();
    const widgets = (0, select_1.selectWidgets)();
    const order = widgets.length > 0 ? widgets[widgets.length - 1].order + 1 : 0;
    lib_1.DB.put(state_1.db, `widget/${id}`, {
        id,
        key,
        order,
        display: { position: defaultWidgetPosition(key) },
    });
};
exports.addWidget = addWidget;
const defaultWidgetPosition = (key) => {
    switch (key) {
        case "widget/notes":
        case "widget/planOfDay":
            return "middleLeft";
        case "widget/todo":
            return "bottomRight";
        default:
            return "middleCentre";
    }
};
const exclusiveWidgetGroups = [["widget/notes", "widget/planOfDay"]];
const singletonWidgetId = (key) => {
    switch (key) {
        case "widget/notes":
            return "default-notes";
        case "widget/planOfDay":
            return "default-plan-of-day";
        default:
            return null;
    }
};
const removeMutuallyExclusiveWidgets = (key) => {
    const group = exclusiveWidgetGroups.find((keys) => keys.includes(key));
    if (!group)
        return;
    (0, select_1.selectWidgets)()
        .filter((widget) => group.includes(widget.key) && widget.key !== key)
        .forEach((widget) => (0, exports.removeWidget)(widget.id));
};
/** Remove a widget */
const removeWidget = (id) => {
    const widget = lib_1.DB.get(state_1.db, `widget/${id}`);
    lib_1.DB.put(state_1.db, `widget/${id}`, null);
    if (widget && singletonWidgetId(widget.key))
        return;
    lib_1.DB.del(state_1.db, `data/${id}`);
    lib_1.DB.del(state_1.cache, id);
};
exports.removeWidget = removeWidget;
/** Reorder a widget */
const reorderWidget = (from, to) => {
    const widgets = (0, select_1.selectWidgets)();
    widgets.splice(to, 0, widgets.splice(from, 1)[0]);
    widgets.forEach((widget, order) => lib_1.DB.put(state_1.db, `widget/${widget.id}`, Object.assign(Object.assign({}, widget), { order })));
};
exports.reorderWidget = reorderWidget;
/** Set display properties of a widget */
const setWidgetDisplay = (id, display) => {
    const widget = lib_1.DB.get(state_1.db, `widget/${id}`);
    if (!widget)
        throw new Error("Widget not found while");
    lib_1.DB.put(state_1.db, `widget/${id}`, Object.assign(Object.assign({}, widget), { display: Object.assign(Object.assign({}, widget.display), display) }));
};
exports.setWidgetDisplay = setWidgetDisplay;
// UI actions
/** Toggle dashboard focus mode */
const toggleFocus = () => {
    lib_1.DB.put(state_1.db, "focus", !lib_1.DB.get(state_1.db, "focus"));
};
exports.toggleFocus = toggleFocus;
// Store actions
/** Import database from a dump */
const importStore = (dump) => {
    // TODO: Add proper schema validation
    if (typeof dump !== "object" || dump === null)
        throw new TypeError("Unexpected format");
    (0, exports.resetStore)();
    if ("backgrounds" in dump) {
        // Version 2 config
        lib_1.DB.put(state_1.db, `widget/default-time`, null);
        lib_1.DB.put(state_1.db, `widget/default-greeting`, null);
        dump = (0, migrate2_1.default)(dump);
    }
    else if (dump.version === 3) {
        // Version 3 config
        delete dump.version;
    }
    else if (dump.version > 3) {
        // Future version
        throw new TypeError("Settings exported from an newer version of Tabliss");
    }
    else {
        // Unknown version
        throw new TypeError("Unknown settings version");
    }
    // @ts-ignore
    Object.entries(dump).forEach(([key, val]) => lib_1.DB.put(state_1.db, key, val));
};
exports.importStore = importStore;
/** Export a database dump */
const exportStore = () => {
    return JSON.stringify(Object.assign(Object.assign({}, Object.fromEntries(lib_1.DB.prefix(state_1.db, ""))), { version: 3 }));
};
exports.exportStore = exportStore;
/** Reset the database */
const resetStore = () => {
    clear(state_1.db);
    clear(state_1.cache);
};
exports.resetStore = resetStore;
const clear = (db) => {
    // @ts-ignore
    for (const [key] of lib_1.DB.prefix(db, ""))
        lib_1.DB.del(db, key);
};
//# sourceMappingURL=action.js.map