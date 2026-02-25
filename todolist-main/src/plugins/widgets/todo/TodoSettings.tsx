import React, { FC, useState } from "react";
import { nanoid } from "nanoid";

import { Props, defaultData, CustomList } from "./types";

const TodoSettings: FC<Props> = ({ data = defaultData, setData }) => {
  const [newListName, setNewListName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const customLists = data.customLists ?? [];

  const addList = () => {
    const trimmed = newListName.trim();
    if (!trimmed) return;
    const newList: CustomList = { id: nanoid(), name: trimmed };
    setData({ ...data, customLists: [...customLists, newList] });
    setNewListName("");
  };

  const removeList = (id: string) => {
    setData({
      ...data,
      customLists: customLists.filter((l) => l.id !== id),
    });
  };

  const startEdit = (list: CustomList) => {
    setEditingId(list.id);
    setEditingName(list.name);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    setData({
      ...data,
      customLists: customLists.map((l) =>
        l.id === editingId ? { ...l, name: trimmed } : l,
      ),
    });
    setEditingId(null);
  };

  return (
    <div className="SearchSettings">
      <label>
        Tasks to show
        <input
          type="number"
          min="0"
          onChange={(event) =>
            setData({ ...data, show: Number(event.target.value) })
          }
          placeholder="Number of todo items to show"
          value={data.show}
        />
      </label>

      <label>
        New task keybind
        <input
          type="text"
          maxLength={1}
          onChange={(event) =>
            setData({ ...data, keyBind: event.target.value })
          }
          value={data.keyBind}
        />
      </label>

      <div style={{ marginTop: 16 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>Lists</p>

        {[{ name: "Due Today" }, { name: "Inbox" }, { name: "Finished" }].map(
          (perm) => (
            <div
              key={perm.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 0",
                opacity: 0.55,
              }}
            >
              <span style={{ flex: 1 }}>{perm.name}</span>
              <span style={{ fontSize: 11, color: "#999" }}>permanent</span>
            </div>
          ),
        )}

        {customLists.map((list) => (
          <div
            key={list.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 0",
            }}
          >
            {editingId === list.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") setEditingId(null);
                }}
                onBlur={saveEdit}
                autoFocus
                style={{ flex: 1 }}
              />
            ) : (
              <>
                <span style={{ flex: 1 }}>{list.name}</span>
                <button
                  onClick={() => startEdit(list)}
                  title="Rename list"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 4px",
                    fontSize: 14,
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => removeList(list.id)}
                  title="Delete list"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 4px",
                    fontSize: 14,
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addList();
            }}
            placeholder="New list name"
            style={{ flex: 1 }}
          />
          <button onClick={addList}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default TodoSettings;
