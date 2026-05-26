"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
function reducer(state, action) {
    switch (action.type) {
        case "ADD_TODO":
            return state.concat(action.data);
        case "REMOVE_TODO":
            return state.filter((todo) => todo.id !== action.data.id);
        case "TOGGLE_TODO":
            return state.map((todo) => todo.id === action.data.id
                ? Object.assign(Object.assign({}, todo), { completed: !todo.completed, dismissed: false }) : todo);
        case "DISMISS_TODO":
            return state.map((todo) => todo.id === action.data.id
                ? Object.assign(Object.assign({}, todo), { dismissed: true }) : todo);
        case "UPDATE_TODO":
            return state.map((todo) => todo.id === action.data.id
                ? Object.assign(Object.assign({}, todo), { contents: action.data.contents }) : todo);
        case "UPDATE_TODO_META":
            return state.map((todo) => todo.id === action.data.id
                ? Object.assign(Object.assign({}, todo), { dueDate: action.data.dueDate, repeat: action.data.repeat }) : todo);
        case "COMPLETE_INSTANCE":
            return state.map((todo) => todo.id === action.data.id
                ? Object.assign(Object.assign({}, todo), { completed: true }) : todo);
        case "COMPLETE_TASK":
            return state.filter((todo) => todo.id !== action.data.id);
        case "COMPLETE_REPEAT_INSTANCE": {
            const parent = state.find((todo) => todo.id === action.data.parentId);
            if (!parent)
                return state;
            // Note: the instance does NOT carry the parent's `repeat`. The instance is a
            // frozen completion record — re-evaluating it against repeat schedules would
            // make it re-appear as a recurring task in its own right.
            const instance = {
                id: action.data.instanceId,
                contents: parent.contents,
                completed: true,
                dueDate: action.data.instanceDueDate,
                parentId: action.data.parentId,
                listId: parent.listId,
            };
            return state
                .map((todo) => todo.id === action.data.parentId
                ? Object.assign(Object.assign({}, todo), { dueDate: action.data.nextDueDate }) : todo)
                .concat(instance);
        }
        case "UNCOMPLETE_REPEAT_INSTANCE": {
            // Remove the completed instance
            const filtered = state.filter((todo) => todo.id !== action.data.instanceId);
            // Only roll back parent's dueDate if the instance's date is earlier
            return filtered.map((todo) => {
                if (todo.id !== action.data.parentId)
                    return todo;
                const instanceDate = action.data.instanceDueDate;
                if (instanceDate &&
                    (!todo.dueDate || instanceDate < todo.dueDate)) {
                    return Object.assign(Object.assign({}, todo), { dueDate: instanceDate });
                }
                return todo;
            });
        }
        case "MOVE_TODO":
            return state.map((todo) => todo.id === action.data.id
                ? Object.assign(Object.assign({}, todo), { listId: action.data.listId }) : todo);
        default:
            throw new Error("Unknown action");
    }
}
exports.reducer = reducer;
//# sourceMappingURL=reducer.js.map