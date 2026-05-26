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
exports.Notes = void 0;
const react_1 = __importStar(require("react"));
const data_1 = require("./data");
const shared_1 = require("../../../views/shared");
const tree_1 = require("./tree");
require("./Notes.sass");
const Notes = ({ data = data_1.defaultData, setData }) => {
    const normalized = (0, react_1.useMemo)(() => (0, tree_1.normalizeData)(data), [data]);
    const noteTitleRef = (0, react_1.useRef)(null);
    const noteBodyRef = (0, react_1.useRef)(null);
    const [renamingId, setRenamingId] = (0, react_1.useState)(null);
    const [renameValue, setRenameValue] = (0, react_1.useState)("");
    const currentFolderId = normalized.currentFolderId;
    const selectedNote = (0, tree_1.getItem)(normalized.items, normalized.selectedNoteId);
    const visibleItems = currentFolderId === tree_1.DELETED_FOLDER_ID
        ? (0, tree_1.getDeletedChildren)(normalized.items, null)
        : (0, tree_1.getChildren)(normalized.items, currentFolderId);
    const folderPath = currentFolderId && currentFolderId !== tree_1.DELETED_FOLDER_ID
        ? (0, tree_1.getFolderPath)(normalized.items, currentFolderId)
        : [];
    const save = (next) => setData(next);
    const splitNoteContents = (contents) => {
        const newline = contents.indexOf("\n");
        if (newline === -1)
            return { title: contents, body: "" };
        return {
            title: contents.slice(0, newline),
            body: contents.slice(newline + 1),
        };
    };
    const noteTitle = selectedNote && selectedNote.type === "note"
        ? splitNoteContents(selectedNote.contents).title
        : "";
    const noteBody = selectedNote && selectedNote.type === "note"
        ? splitNoteContents(selectedNote.contents).body
        : "";
    (0, react_1.useLayoutEffect)(() => {
        resizeTitle();
    }, [noteTitle]);
    (0, react_1.useLayoutEffect)(() => {
        resizeBody();
    }, [noteBody]);
    const resizeTitle = () => {
        const title = noteTitleRef.current;
        if (!title)
            return;
        title.style.height = "auto";
        title.style.height = `${title.scrollHeight}px`;
    };
    const resizeBody = () => {
        const body = noteBodyRef.current;
        if (!body)
            return;
        body.style.height = "auto";
        body.style.height = `${body.scrollHeight}px`;
    };
    const getDisplayName = (item) => {
        if (item.type === "folder")
            return item.name;
        const title = splitNoteContents(item.contents).title.trim();
        return title || item.name;
    };
    const createItem = (type) => {
        const now = Date.now().toString(36);
        const item = type === "note"
            ? {
                id: `note-${now}`,
                type,
                name: "Untitled Note",
                parentId: currentFolderId === tree_1.DELETED_FOLDER_ID ? null : currentFolderId,
                contents: "",
            }
            : {
                id: `folder-${now}`,
                type,
                name: "New Folder",
                parentId: currentFolderId === tree_1.DELETED_FOLDER_ID ? null : currentFolderId,
            };
        save(Object.assign(Object.assign({}, normalized), { items: [...normalized.items, item], selectedNoteId: item.type === "note" ? item.id : normalized.selectedNoteId, currentFolderId: currentFolderId === tree_1.DELETED_FOLDER_ID ? null : currentFolderId }));
        if (item.type === "folder")
            startRename(item.id, item.name);
    };
    const startRename = (id, name) => {
        setRenamingId(id);
        setRenameValue(name);
    };
    const commitRename = () => {
        if (!renamingId)
            return;
        const trimmed = renameValue.trim();
        if (trimmed) {
            save(Object.assign(Object.assign({}, normalized), { items: normalized.items.map((item) => item.id === renamingId ? Object.assign(Object.assign({}, item), { name: trimmed }) : item) }));
        }
        setRenamingId(null);
        setRenameValue("");
    };
    const selectItem = (item) => {
        if (item.type === "folder") {
            save(Object.assign(Object.assign({}, normalized), { currentFolderId: item.id, selectedNoteId: null }));
        }
        else {
            save(Object.assign(Object.assign({}, normalized), { selectedNoteId: item.id }));
        }
    };
    const updateContents = (contents) => {
        if (!selectedNote || selectedNote.type !== "note")
            return;
        save(Object.assign(Object.assign({}, normalized), { items: normalized.items.map((item) => item.id === selectedNote.id && item.type === "note"
                ? Object.assign(Object.assign({}, item), { contents }) : item) }));
    };
    const updateNoteTitle = (title) => {
        if (!selectedNote || selectedNote.type !== "note")
            return;
        updateContents(noteBody ? `${title}\n${noteBody}` : title);
    };
    const updateNoteBody = (body) => {
        if (!selectedNote || selectedNote.type !== "note")
            return;
        updateContents(noteTitle || body ? `${noteTitle}\n${body}` : "");
    };
    const deleteItem = (id) => {
        const nextItems = (0, tree_1.softDeleteItemWithDescendants)(normalized.items, id);
        save(Object.assign(Object.assign({}, normalized), { items: nextItems, selectedNoteId: normalized.selectedNoteId === id ? null : normalized.selectedNoteId, currentFolderId: normalized.currentFolderId === id ? null : normalized.currentFolderId }));
    };
    const closeNote = () => save(Object.assign(Object.assign({}, normalized), { selectedNoteId: null }));
    const restoreItem = (id) => {
        const restored = new Set([id]);
        let changed = true;
        while (changed) {
            changed = false;
            normalized.items.forEach((item) => {
                if (item.parentId &&
                    restored.has(item.parentId) &&
                    !restored.has(item.id)) {
                    restored.add(item.id);
                    changed = true;
                }
            });
        }
        save(Object.assign(Object.assign({}, normalized), { items: normalized.items.map((item) => restored.has(item.id)
                ? Object.assign(Object.assign({}, item), { deleted: false, deletedAt: undefined, parentId: null }) : item), currentFolderId: null, selectedNoteId: id }));
    };
    return (react_1.default.createElement("div", { className: "Notes" },
        react_1.default.createElement("div", { className: "panel" }, selectedNote && selectedNote.type === "note" ? (react_1.default.createElement("div", { className: "editor" },
            react_1.default.createElement("div", { className: "editor-toolbar" },
                react_1.default.createElement("button", { "aria-label": "Back to notes", onClick: closeNote },
                    react_1.default.createElement(shared_1.Icon, { name: "chevron-left", size: 18 })),
                react_1.default.createElement("button", { "aria-label": "Delete note", onClick: () => deleteItem(selectedNote.id) },
                    react_1.default.createElement(shared_1.Icon, { name: "trash", size: 16 }))),
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("textarea", { ref: noteTitleRef, className: "note-title", value: noteTitle, placeholder: "Untitled Note", rows: 1, onChange: (event) => {
                        updateNoteTitle(event.target.value.replace(/\n/g, " "));
                        requestAnimationFrame(resizeTitle);
                    }, onKeyDown: (event) => {
                        var _a;
                        if (event.key === "Enter") {
                            event.preventDefault();
                            (_a = noteBodyRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                        }
                    }, autoFocus: true }),
                react_1.default.createElement("textarea", { ref: noteBodyRef, value: noteBody, onChange: (event) => {
                        updateNoteBody(event.target.value);
                        requestAnimationFrame(resizeBody);
                    }, spellCheck: true })))) : (react_1.default.createElement("div", { className: "directory" },
            react_1.default.createElement("div", { className: "toolbar" },
                react_1.default.createElement("button", { onClick: () => save(Object.assign(Object.assign({}, normalized), { currentFolderId: null })) }, "Notes"),
                react_1.default.createElement("button", { "aria-label": "Deleted notes", onClick: () => save(Object.assign(Object.assign({}, normalized), { currentFolderId: tree_1.DELETED_FOLDER_ID, selectedNoteId: null })) },
                    react_1.default.createElement(shared_1.Icon, { name: "trash-2", size: 16 })),
                react_1.default.createElement("button", { "aria-label": "New folder", onClick: () => createItem("folder") },
                    react_1.default.createElement(shared_1.Icon, { name: "folder-plus", size: 16 })),
                react_1.default.createElement("button", { "aria-label": "New note", onClick: () => createItem("note") },
                    react_1.default.createElement(shared_1.Icon, { name: "file-plus", size: 16 }))),
            react_1.default.createElement("div", { className: "path" }, currentFolderId === tree_1.DELETED_FOLDER_ID ? (react_1.default.createElement("button", null, "Deleted")) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("button", { onClick: () => save(Object.assign(Object.assign({}, normalized), { currentFolderId: null })) }, "Home"),
                folderPath.map((folder) => (react_1.default.createElement("button", { key: folder.id, onClick: () => save(Object.assign(Object.assign({}, normalized), { currentFolderId: folder.id, selectedNoteId: null })) }, folder.name)))))),
            react_1.default.createElement("div", { className: "items" }, visibleItems.length === 0 ? (react_1.default.createElement("div", { className: "empty" }, currentFolderId === tree_1.DELETED_FOLDER_ID
                ? "No deleted notes"
                : "No notes here")) : (visibleItems.map((item) => (react_1.default.createElement("div", { key: item.id, className: "item" },
                react_1.default.createElement("button", { className: "item-main", onClick: () => selectItem(item) },
                    react_1.default.createElement(shared_1.Icon, { name: item.type === "folder" ? "folder" : "file-text", size: 15 }),
                    renamingId === item.id ? (react_1.default.createElement("input", { value: renameValue, onChange: (event) => setRenameValue(event.target.value), onBlur: commitRename, onKeyDown: (event) => {
                            if (event.key === "Enter")
                                commitRename();
                            if (event.key === "Escape")
                                setRenamingId(null);
                        }, autoFocus: true })) : (react_1.default.createElement("span", null, getDisplayName(item)))),
                currentFolderId === tree_1.DELETED_FOLDER_ID ? (react_1.default.createElement("button", { className: "icon", "aria-label": "Restore", onClick: () => restoreItem(item.id) },
                    react_1.default.createElement(shared_1.Icon, { name: "rotate-ccw", size: 14 }))) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("button", { className: "icon", "aria-label": "Rename", onClick: () => startRename(item.id, item.name) },
                        react_1.default.createElement(shared_1.Icon, { name: "edit-2", size: 14 })),
                    react_1.default.createElement("button", { className: "icon", "aria-label": "Delete", onClick: () => deleteItem(item.id) },
                        react_1.default.createElement(shared_1.Icon, { name: "trash", size: 14 }))))))))))))));
};
exports.Notes = Notes;
//# sourceMappingURL=Notes.js.map