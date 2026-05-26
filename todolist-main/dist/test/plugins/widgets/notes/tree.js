"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteItemWithDescendants = exports.getFolderPath = exports.getDeletedChildren = exports.getChildren = exports.getItem = exports.normalizeData = exports.DELETED_FOLDER_ID = void 0;
exports.DELETED_FOLDER_ID = "__deleted__";
const normalizeData = (data) => {
    var _a, _b, _c, _d, _e;
    if (!data)
        return { items: [], selectedNoteId: null, currentFolderId: null };
    if ("items" in data && Array.isArray(data.items)) {
        const ids = new Set(data.items.map((item) => item.id));
        const selectedNote = data.selectedNoteId
            ? data.items.find((item) => item.id === data.selectedNoteId && item.type === "note")
            : undefined;
        const currentFolder = data.currentFolderId
            ? data.items.find((item) => item.id === data.currentFolderId && item.type === "folder")
            : undefined;
        const currentFolderId = data.currentFolderId === exports.DELETED_FOLDER_ID
            ? exports.DELETED_FOLDER_ID
            : (_a = currentFolder === null || currentFolder === void 0 ? void 0 : currentFolder.id) !== null && _a !== void 0 ? _a : null;
        return {
            items: data.items.map((item) => {
                var _a;
                return (Object.assign(Object.assign({}, item), { parentId: item.parentId && ids.has(item.parentId) ? item.parentId : null, contents: item.type === "note" ? (_a = item.contents) !== null && _a !== void 0 ? _a : "" : undefined, deleted: item.deleted === true }));
            }),
            selectedNoteId: (_b = selectedNote === null || selectedNote === void 0 ? void 0 : selectedNote.id) !== null && _b !== void 0 ? _b : null,
            currentFolderId,
        };
    }
    const legacyContents = "notes" in data ? (_e = (_d = (_c = data.notes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.contents) !== null && _e !== void 0 ? _e : "" : "";
    if (!legacyContents)
        return { items: [], selectedNoteId: null, currentFolderId: null };
    return {
        items: [
            {
                id: "imported-note",
                type: "note",
                name: "Imported Note",
                parentId: null,
                contents: legacyContents,
            },
        ],
        selectedNoteId: "imported-note",
        currentFolderId: null,
    };
};
exports.normalizeData = normalizeData;
const getItem = (items, id) => id ? items.find((item) => item.id === id) : undefined;
exports.getItem = getItem;
const getChildren = (items, parentId) => items
    .filter((item) => !item.deleted && item.parentId === (parentId !== null && parentId !== void 0 ? parentId : null))
    .sort(sortItems);
exports.getChildren = getChildren;
const getDeletedChildren = (items, parentId) => {
    const deletedIds = new Set(items.filter((item) => item.deleted).map((item) => item.id));
    return items
        .filter((item) => {
        if (!item.deleted)
            return false;
        if (parentId)
            return item.parentId === parentId;
        return !item.parentId || !deletedIds.has(item.parentId);
    })
        .sort((a, b) => {
        var _a, _b, _c, _d;
        if (((_a = a.deletedAt) !== null && _a !== void 0 ? _a : "") !== ((_b = b.deletedAt) !== null && _b !== void 0 ? _b : "")) {
            return ((_c = b.deletedAt) !== null && _c !== void 0 ? _c : "").localeCompare((_d = a.deletedAt) !== null && _d !== void 0 ? _d : "");
        }
        return sortItems(a, b);
    });
};
exports.getDeletedChildren = getDeletedChildren;
const getFolderPath = (items, folderId) => {
    const path = [];
    let current = (0, exports.getItem)(items, folderId);
    while (current && current.type === "folder") {
        path.unshift(current);
        current = (0, exports.getItem)(items, current.parentId);
    }
    return path;
};
exports.getFolderPath = getFolderPath;
const softDeleteItemWithDescendants = (items, id, deletedAt = new Date().toISOString()) => {
    const toDelete = new Set([id]);
    let changed = true;
    while (changed) {
        changed = false;
        items.forEach((item) => {
            if (item.parentId && toDelete.has(item.parentId) && !toDelete.has(item.id)) {
                toDelete.add(item.id);
                changed = true;
            }
        });
    }
    return items.map((item) => toDelete.has(item.id) ? Object.assign(Object.assign({}, item), { deleted: true, deletedAt }) : item);
};
exports.softDeleteItemWithDescendants = softDeleteItemWithDescendants;
const sortItems = (a, b) => {
    if (a.type !== b.type)
        return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
};
//# sourceMappingURL=tree.js.map