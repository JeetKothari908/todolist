"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const shared_1 = require("../../../views/shared");
const actions_1 = require("./actions");
const reducer_1 = require("./reducer");
const TodoList_1 = __importDefault(require("./TodoList"));
const types_1 = require("./types");
const Todo = ({ data = types_1.defaultData, setData }) => {
    var _a;
    const [showCompleted, toggleShowCompleted] = (0, hooks_1.useToggle)();
    const [showMore, toggleShowMore] = (0, hooks_1.useToggle)();
    const setItems = (items) => setData(Object.assign(Object.assign({}, data), { items }));
    const [todoItems, dispatch] = (0, hooks_1.useSavedReducer)(reducer_1.reducer, data.items, setItems);
    const items = todoItems.filter((item) => !item.completed || showCompleted);
    const show = !showMore ? data.show : undefined;
    const keyBind = (_a = data.keyBind) !== null && _a !== void 0 ? _a : "T";
    (0, hooks_1.useKeyPress)((event) => {
        event.preventDefault();
        dispatch((0, actions_1.addTodo)());
    }, [keyBind.toUpperCase(), keyBind.toLowerCase()]);
    return (react_1.default.createElement("div", { className: "Todo" },
        react_1.default.createElement(TodoList_1.default, { items: items, onToggle: (...args) => dispatch((0, actions_1.toggleTodo)(...args)), onCompleteInstance: (...args) => dispatch((0, actions_1.completeInstance)(...args)), onCompleteTask: (...args) => dispatch((0, actions_1.completeTask)(...args)), onUpdate: (...args) => dispatch((0, actions_1.updateTodo)(...args)), onRemove: (...args) => dispatch((0, actions_1.removeTodo)(...args)), show: show }),
        react_1.default.createElement("div", null,
            react_1.default.createElement("a", { onClick: () => dispatch((0, actions_1.addTodo)()) },
                react_1.default.createElement(shared_1.ExpandIcon, null)),
            " ",
            react_1.default.createElement("a", { onClick: toggleShowCompleted },
                react_1.default.createElement(shared_1.Icon, { name: showCompleted ? "check-circle" : "circle" })),
            " ",
            items.length > data.show && (react_1.default.createElement("a", { onClick: toggleShowMore }, showMore ? react_1.default.createElement(shared_1.UpIcon, null) : react_1.default.createElement(shared_1.DownIcon, null))))));
};
exports.default = Todo;
//# sourceMappingURL=Todo.js.map