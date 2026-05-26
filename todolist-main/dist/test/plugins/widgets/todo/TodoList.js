"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const TodoItem_1 = __importDefault(require("./TodoItem"));
require("./TodoList.sass");
const TodoList = ({ items, onToggle, onCompleteInstance, onCompleteTask, onUpdate, onRemove, show, }) => {
    const visible = show === undefined ? items : show <= 0 ? [] : items.slice(-show);
    return (react_1.default.createElement("div", { className: "TodoList" }, visible.map((item) => (react_1.default.createElement(TodoItem_1.default, { key: item.id, item: item, onToggle: () => onToggle(item.id), onCompleteInstance: () => onCompleteInstance(item.id), onCompleteTask: () => onCompleteTask(item.id), onUpdate: (contents) => onUpdate(item.id, contents), onDelete: () => onRemove(item.id) })))));
};
exports.default = TodoList;
//# sourceMappingURL=TodoList.js.map