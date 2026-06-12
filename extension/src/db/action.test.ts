jest.mock("in-browser-language", () => ({
  pick: (_locales: string[], fallback: string) => fallback,
}));

jest.mock("../lib", () => {
  const actual = jest.requireActual("../lib");
  const storage = jest.fn(() => Promise.resolve(actual.Stream.init()));

  return {
    ...actual,
    Storage: {
      ...actual.Storage,
      extensionLocal: storage,
      indexeddb: storage,
      remoteSync: storage,
    },
  };
});

(globalThis as any).BUILD_TARGET = "web";
(globalThis as any).SYNC_SERVER_URL = "";
(globalThis as any).SYNC_AUTH_TOKEN = "";

const { DB } = jest.requireActual("../lib") as typeof import("../lib");
const { addWidget, ensureSingletonWidget, resetStore } = jest.requireActual(
  "./action",
) as typeof import("./action");
const { db } = jest.requireActual("./state") as typeof import("./state");

afterEach(() => {
  resetStore();
});

test("ensureSingletonWidget preserves legacy notes data", () => {
  const notesData = {
    items: [
      {
        id: "note-1",
        type: "note",
        name: "Untitled Note",
        parentId: null,
        contents: "Saved note\nStill here",
      },
    ],
    selectedNoteId: "note-1",
    currentFolderId: null,
  };

  DB.put(db, "widget/legacy-notes", {
    id: "legacy-notes",
    key: "widget/notes",
    order: 4,
    display: { position: "middleLeft" },
  });
  DB.put(db, "data/legacy-notes", notesData);

  ensureSingletonWidget("widget/notes");

  expect(DB.get(db, "widget/default-notes")).toEqual({
    id: "default-notes",
    key: "widget/notes",
    order: 4,
    display: { position: "middleLeft" },
  });
  expect(DB.get(db, "data/default-notes")).toEqual(notesData);
  expect(DB.get(db, "widget/legacy-notes")).toBeNull();
  expect(DB.get(db, "data/legacy-notes")).toBeUndefined();
});

test("addWidget recovers notes data saved under the plugin key", () => {
  const notesData = {
    items: [
      {
        id: "note-1",
        type: "note",
        name: "Untitled Note",
        parentId: null,
        contents: "Saved by plugin key",
      },
    ],
    selectedNoteId: "note-1",
    currentFolderId: null,
  };

  DB.put(db, "data/widget/notes", notesData);

  addWidget("widget/notes");

  expect(DB.get(db, "data/default-notes")).toEqual(notesData);
  expect(DB.get(db, "data/widget/notes")).toBeUndefined();
});
