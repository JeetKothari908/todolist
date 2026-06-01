import { reducer } from "./reducer";
import {
  addTodo,
  completeRepeatInstance,
  removeTodo,
  toggleTodo,
  updateTodo,
  updateTodoMeta,
} from "./actions";

describe("todo/reducer", () => {
  it("should add todo", () => {
    expect(reducer([], addTodo("Test todo"))).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        contents: "Test todo",
        completed: false,
      }),
    ]);

    expect(
      reducer(
        [
          {
            id: "1234",
            contents: "Existing todo",
            completed: true,
          },
        ],
        addTodo("Test todo"),
      ),
    ).toEqual([
      expect.objectContaining({
        id: "1234",
        contents: "Existing todo",
        completed: true,
      }),
      expect.objectContaining({
        id: expect.any(String),
        contents: "Test todo",
        completed: false,
      }),
    ]);
  });

  it("should remove todo", () => {
    expect(
      reducer(
        [
          {
            id: "1234",
            contents: "Existing todo",
            completed: true,
          },
        ],
        removeTodo("1234"),
      ),
    ).toEqual([]);

    expect(
      reducer(
        [
          {
            id: "1234",
            contents: "Existing todo",
            completed: true,
          },
          {
            id: "5678",
            contents: "Second existing todo",
            completed: false,
          },
        ],
        removeTodo("1234"),
      ),
    ).toEqual([
      expect.objectContaining({
        id: "5678",
        contents: "Second existing todo",
        completed: false,
      }),
    ]);
  });

  it("should toggle todo", () => {
    expect(
      reducer(
        [
          {
            id: "1234",
            contents: "Existing todo",
            completed: true,
          },
          {
            id: "5678",
            contents: "Second existing todo",
            completed: false,
          },
        ],
        toggleTodo("1234"),
      ),
    ).toEqual([
      expect.objectContaining({
        id: "1234",
        contents: "Existing todo",
        completed: false,
      }),
      expect.objectContaining({
        id: "5678",
        contents: "Second existing todo",
        completed: false,
      }),
    ]);

    expect(
      reducer(
        [
          {
            id: "1234",
            contents: "Existing todo",
            completed: true,
          },
          {
            id: "5678",
            contents: "Second existing todo",
            completed: false,
          },
        ],
        toggleTodo("5678"),
      ),
    ).toEqual([
      expect.objectContaining({
        id: "1234",
        contents: "Existing todo",
        completed: true,
      }),
      expect.objectContaining({
        id: "5678",
        contents: "Second existing todo",
        completed: true,
      }),
    ]);
  });

  it("should update todo", () => {
    expect(
      reducer(
        [
          {
            id: "1234",
            contents: "Existing todo",
            completed: true,
          },
          {
            id: "5678",
            contents: "Second existing todo",
            completed: false,
          },
        ],
        updateTodo("1234", "Existing todo: edited"),
      ),
    ).toEqual([
      expect.objectContaining({
        id: "1234",
        contents: "Existing todo: edited",
        completed: true,
      }),
      expect.objectContaining({
        id: "5678",
        contents: "Second existing todo",
        completed: false,
      }),
    ]);
  });

  it("should add and update due time metadata", () => {
    const [todo] = reducer(
      [],
      addTodo("Timed todo", { dueDate: "2026-06-02", dueTime: "17:00" }),
    );

    expect(todo).toEqual(
      expect.objectContaining({
        contents: "Timed todo",
        dueDate: "2026-06-02",
        dueTime: "17:00",
      }),
    );

    expect(
      reducer([todo], updateTodoMeta(todo.id, {
        dueDate: "2026-06-03",
        dueTime: "18:30",
      })),
    ).toEqual([
      expect.objectContaining({
        dueDate: "2026-06-03",
        dueTime: "18:30",
      }),
    ]);
  });

  it("should preserve due time on completed repeat instances", () => {
    expect(
      reducer(
        [
          {
            id: "parent",
            contents: "Weekly todo",
            completed: false,
            dueDate: "2026-06-02",
            dueTime: "17:00",
            repeat: { type: "weekly", days: [2] },
          },
        ],
        completeRepeatInstance("parent", "2026-06-02", "17:00", "2026-06-09"),
      ),
    ).toEqual([
      expect.objectContaining({
        id: "parent",
        dueDate: "2026-06-09",
        dueTime: "17:00",
      }),
      expect.objectContaining({
        contents: "Weekly todo",
        completed: true,
        dueDate: "2026-06-02",
        dueTime: "17:00",
        parentId: "parent",
      }),
    ]);
  });

  it("should throw on unknown action", () => {
    expect(() => reducer([], { type: "UNKNOWN" } as any)).toThrow();
  });
});
