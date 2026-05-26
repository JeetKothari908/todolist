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
const nanoid_1 = require("nanoid");
const types_1 = require("./types");
const TodoSettings = ({ data = types_1.defaultData, setData }) => {
    var _a;
    const [newListName, setNewListName] = (0, react_1.useState)("");
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editingName, setEditingName] = (0, react_1.useState)("");
    const customLists = (_a = data.customLists) !== null && _a !== void 0 ? _a : [];
    const addList = () => {
        const trimmed = newListName.trim();
        if (!trimmed)
            return;
        const newList = { id: (0, nanoid_1.nanoid)(), name: trimmed };
        setData(Object.assign(Object.assign({}, data), { customLists: [...customLists, newList] }));
        setNewListName("");
    };
    const removeList = (id) => {
        setData(Object.assign(Object.assign({}, data), { customLists: customLists.filter((l) => l.id !== id) }));
    };
    const startEdit = (list) => {
        setEditingId(list.id);
        setEditingName(list.name);
    };
    const saveEdit = () => {
        if (!editingId)
            return;
        const trimmed = editingName.trim();
        if (!trimmed) {
            setEditingId(null);
            return;
        }
        setData(Object.assign(Object.assign({}, data), { customLists: customLists.map((l) => l.id === editingId ? Object.assign(Object.assign({}, l), { name: trimmed }) : l) }));
        setEditingId(null);
    };
    return (react_1.default.createElement("div", { className: "SearchSettings" },
        react_1.default.createElement("label", null,
            "Tasks to show",
            react_1.default.createElement("input", { type: "number", min: "0", onChange: (event) => {
                    const raw = event.target.value;
                    if (raw === "") {
                        setData(Object.assign(Object.assign({}, data), { show: types_1.defaultData.show }));
                        return;
                    }
                    const parsed = Number(raw);
                    if (!Number.isFinite(parsed))
                        return;
                    setData(Object.assign(Object.assign({}, data), { show: Math.max(0, Math.floor(parsed)) }));
                }, placeholder: "Number of todo items to show", value: data.show })),
        react_1.default.createElement("label", null,
            "New task keybind",
            react_1.default.createElement("input", { type: "text", maxLength: 1, onChange: (event) => setData(Object.assign(Object.assign({}, data), { keyBind: event.target.value })), value: data.keyBind })),
        react_1.default.createElement("div", { style: { marginTop: 16 } },
            react_1.default.createElement("p", { style: { fontWeight: 600, marginBottom: 8 } }, "Lists"),
            [{ name: "Due Today" }, { name: "Inbox" }, { name: "Finished" }].map((perm) => (react_1.default.createElement("div", { key: perm.name, style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 0",
                    opacity: 0.55,
                } },
                react_1.default.createElement("span", { style: { flex: 1 } }, perm.name),
                react_1.default.createElement("span", { style: { fontSize: 11, color: "#999" } }, "permanent")))),
            customLists.map((list) => (react_1.default.createElement("div", { key: list.id, style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 0",
                } }, editingId === list.id ? (react_1.default.createElement("input", { type: "text", value: editingName, onChange: (e) => setEditingName(e.target.value), onKeyDown: (e) => {
                    if (e.key === "Enter")
                        saveEdit();
                    if (e.key === "Escape")
                        setEditingId(null);
                }, onBlur: saveEdit, autoFocus: true, style: { flex: 1 } })) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("span", { style: { flex: 1 } }, list.name),
                react_1.default.createElement("button", { onClick: () => startEdit(list), title: "Rename list", style: {
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px 4px",
                        fontSize: 14,
                    } }, "\u270F\uFE0F"),
                react_1.default.createElement("button", { onClick: () => removeList(list.id), title: "Delete list", style: {
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px 4px",
                        fontSize: 14,
                    } }, "\uD83D\uDDD1\uFE0F")))))),
            react_1.default.createElement("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 8,
                } },
                react_1.default.createElement("input", { type: "text", value: newListName, onChange: (e) => setNewListName(e.target.value), onKeyDown: (e) => {
                        if (e.key === "Enter")
                            addList();
                    }, placeholder: "New list name", style: { flex: 1 } }),
                react_1.default.createElement("button", { onClick: addList }, "Add")))));
};
exports.default = TodoSettings;
//# sourceMappingURL=TodoSettings.js.map