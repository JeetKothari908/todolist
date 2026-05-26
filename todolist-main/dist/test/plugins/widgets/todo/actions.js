"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTodo = exports.uncompleteRepeatInstance = exports.completeRepeatInstance = exports.completeTask = exports.completeInstance = exports.updateTodoMeta = exports.updateTodo = exports.dismissTodo = exports.toggleTodo = exports.removeTodo = exports.addTodo = void 0;
const nanoid_1 = require("nanoid");
function addTodo(contents = "", meta) {
    return {
        type: "ADD_TODO",
        data: {
            contents,
            id: (0, nanoid_1.nanoid)(),
            completed: false,
            dueDate: meta === null || meta === void 0 ? void 0 : meta.dueDate,
            repeat: meta === null || meta === void 0 ? void 0 : meta.repeat,
            listId: meta === null || meta === void 0 ? void 0 : meta.listId,
        },
    };
}
exports.addTodo = addTodo;
function removeTodo(id) {
    return {
        type: "REMOVE_TODO",
        data: { id },
    };
}
exports.removeTodo = removeTodo;
function toggleTodo(id) {
    return {
        type: "TOGGLE_TODO",
        data: { id },
    };
}
exports.toggleTodo = toggleTodo;
function dismissTodo(id) {
    return {
        type: "DISMISS_TODO",
        data: { id },
    };
}
exports.dismissTodo = dismissTodo;
function updateTodo(id, contents) {
    return {
        type: "UPDATE_TODO",
        data: { id, contents },
    };
}
exports.updateTodo = updateTodo;
function updateTodoMeta(id, meta) {
    return {
        type: "UPDATE_TODO_META",
        data: Object.assign({ id }, meta),
    };
}
exports.updateTodoMeta = updateTodoMeta;
function completeInstance(id) {
    return {
        type: "COMPLETE_INSTANCE",
        data: { id },
    };
}
exports.completeInstance = completeInstance;
function completeTask(id) {
    return {
        type: "COMPLETE_TASK",
        data: { id },
    };
}
exports.completeTask = completeTask;
function completeRepeatInstance(parentId, instanceDueDate, nextDueDate) {
    return {
        type: "COMPLETE_REPEAT_INSTANCE",
        data: {
            parentId,
            instanceId: (0, nanoid_1.nanoid)(),
            instanceDueDate,
            nextDueDate,
        },
    };
}
exports.completeRepeatInstance = completeRepeatInstance;
function uncompleteRepeatInstance(instanceId, parentId, instanceDueDate) {
    return {
        type: "UNCOMPLETE_REPEAT_INSTANCE",
        data: { instanceId, parentId, instanceDueDate },
    };
}
exports.uncompleteRepeatInstance = uncompleteRepeatInstance;
function moveTodo(id, listId) {
    return {
        type: "MOVE_TODO",
        data: { id, listId },
    };
}
exports.moveTodo = moveTodo;
//# sourceMappingURL=actions.js.map