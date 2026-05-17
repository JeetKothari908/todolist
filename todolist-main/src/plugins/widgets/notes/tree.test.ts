import {
  DELETED_FOLDER_ID,
  getChildren,
  getDeletedChildren,
  getFolderPath,
  normalizeData,
  softDeleteItemWithDescendants,
} from "./tree";
import { Item } from "./data";

describe("notes/tree", () => {
  const items: Item[] = [
    { id: "root-note", type: "note", name: "Root Note", parentId: null, contents: "" },
    { id: "work", type: "folder", name: "Work", parentId: null },
    { id: "school", type: "folder", name: "School", parentId: null },
    { id: "essay", type: "note", name: "Essay", parentId: "school", contents: "Draft" },
    { id: "archive", type: "folder", name: "Archive", parentId: "school" },
    { id: "old", type: "note", name: "Old", parentId: "archive", contents: "" },
  ];

  it("sorts folders before notes in a directory", () => {
    expect(getChildren(items, null).map((item) => item.id)).toEqual([
      "school",
      "work",
      "root-note",
    ]);
  });

  it("builds a nested folder path", () => {
    expect(getFolderPath(items, "archive").map((item) => item.id)).toEqual([
      "school",
      "archive",
    ]);
  });

  it("soft-deletes folders with their descendants", () => {
    const deleted = softDeleteItemWithDescendants(
      items,
      "school",
      "2026-05-01T12:00:00.000Z",
    );
    expect(deleted.filter((item) => item.deleted).map((item) => item.id)).toEqual([
      "school",
      "essay",
      "archive",
      "old",
    ]);
  });

  it("shows top-level deleted items in the deleted folder", () => {
    const deleted = softDeleteItemWithDescendants(
      items,
      "school",
      "2026-05-01T12:00:00.000Z",
    );
    expect(getDeletedChildren(deleted, null).map((item) => item.id)).toEqual([
      "school",
    ]);
    expect(getDeletedChildren(deleted, "school").map((item) => item.id)).toEqual([
      "archive",
      "essay",
    ]);
  });

  it("imports the old single-note data shape", () => {
    expect(normalizeData({ notes: [{ contents: "Remember this" }] })).toEqual({
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
    expect(
      normalizeData({
        items,
        currentFolderId: DELETED_FOLDER_ID,
        selectedNoteId: null,
      }).currentFolderId,
    ).toBe(DELETED_FOLDER_ID);
  });
});
