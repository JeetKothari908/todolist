"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reducer_1 = require("./reducer");
const actions_1 = require("./actions");
describe("todo/reducer", () => {
    it("should add todo", () => {
        expect((0, reducer_1.reducer)([], (0, actions_1.addTodo)("Test todo"))).toEqual([
            expect.objectContaining({
                id: expect.any(String),
                contents: "Test todo",
                completed: false,
            }),
        ]);
        expect((0, reducer_1.reducer)([
            {
                id: "1234",
                contents: "Existing todo",
                completed: true,
            },
        ], (0, actions_1.addTodo)("Test todo"))).toEqual([
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
        expect((0, reducer_1.reducer)([
            {
                id: "1234",
                contents: "Existing todo",
                completed: true,
            },
        ], (0, actions_1.removeTodo)("1234"))).toEqual([]);
        expect((0, reducer_1.reducer)([
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
        ], (0, actions_1.removeTodo)("1234"))).toEqual([
            expect.objectContaining({
                id: "5678",
                contents: "Second existing todo",
                completed: false,
            }),
        ]);
    });
    it("should toggle todo", () => {
        expect((0, reducer_1.reducer)([
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
        ], (0, actions_1.toggleTodo)("1234"))).toEqual([
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
        expect((0, reducer_1.reducer)([
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
        ], (0, actions_1.toggleTodo)("5678"))).toEqual([
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
        expect((0, reducer_1.reducer)([
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
        ], (0, actions_1.updateTodo)("1234", "Existing todo: edited"))).toEqual([
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
    it("should throw on unknown action", () => {
        expect(() => (0, reducer_1.reducer)([], { type: "UNKNOWN" })).toThrow();
    });
});
//# sourceMappingURL=reducer.test.js.map