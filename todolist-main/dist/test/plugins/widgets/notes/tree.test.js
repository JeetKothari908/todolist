"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_1 = require("./tree");
describe("notes/tree", () => {
    const items = [
        { id: "root-note", type: "note", name: "Root Note", parentId: null, contents: "" },
        { id: "work", type: "folder", name: "Work", parentId: null },
        { id: "school", type: "folder", name: "School", parentId: null },
        { id: "essay", type: "note", name: "Essay", parentId: "school", contents: "Draft" },
        { id: "archive", type: "folder", name: "Archive", parentId: "school" },
        { id: "old", type: "note", name: "Old", parentId: "archive", contents: "" },
    ];
    it("sorts folders before notes in a directory", () => {
        expect((0, tree_1.getChildren)(items, null).map((item) => item.id)).toEqual([
            "school",
            "work",
            "root-note",
        ]);
    });
    it("builds a nested folder path", () => {
        expect((0, tree_1.getFolderPath)(items, "archive").map((item) => item.id)).toEqual([
            "school",
            "archive",
        ]);
    });
    it("soft-deletes folders with their descendants", () => {
        const deleted = (0, tree_1.softDeleteItemWithDescendants)(items, "school", "2026-05-01T12:00:00.000Z");
        expect(deleted.filter((item) => item.deleted).map((item) => item.id)).toEqual([
            "school",
            "essay",
            "archive",
            "old",
        ]);
    });
    it("shows top-level deleted items in the deleted folder", () => {
        const deleted = (0, tree_1.softDeleteItemWithDescendants)(items, "school", "2026-05-01T12:00:00.000Z");
        expect((0, tree_1.getDeletedChildren)(deleted, null).map((item) => item.id)).toEqual([
            "school",
        ]);
        expect((0, tree_1.getDeletedChildren)(deleted, "school").map((item) => item.id)).toEqual([
            "archive",
            "essay",
        ]);
    });
    it("imports the old single-note data shape", () => {
        expect((0, tree_1.normalizeData)({ notes: [{ contents: "Remember this" }] })).toEqual({
            items: [
                {
                    id: "imported-note",
                    type: "note",
                    name: "Imported Note",
                    parentId: null,
                    contents: "Remember this",
                },
            ],
            selectedNoteId: "imported-note",
            currentFolderId: null,
        });
    });
    it("preserves the virtual deleted folder selection", () => {
        expect((0, tree_1.normalizeData)({
            items,
            currentFolderId: tree_1.DELETED_FOLDER_ID,
            selectedNoteId: null,
        }).currentFolderId).toBe(tree_1.DELETED_FOLDER_ID);
    });
});
//# sourceMappingURL=tree.test.js.map