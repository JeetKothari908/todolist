"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const hooks_1 = require("../../../hooks");
const shared_1 = require("../../../views/shared");
require("./TodoItem.sass");
const TodoItem = ({ item, onDelete, onUpdate, onToggle, onCompleteInstance, onCompleteTask }) => {
    const ref = (0, react_1.useRef)(null);
    const [showMenu, setShowMenu] = (0, react_1.useState)(false);
    // Flush any pending contentEditable text (since the action buttons don't necessarily
    // steal focus from the span, onBlur may not fire on its own).
    const commitPendingEdit = () => {
        if (ref.current && ref.current.innerText !== item.contents) {
            onUpdate(ref.current.innerText);
        }
    };
    (0, react_1.useLayoutEffect)(() => {
        if (ref.current) {
            ref.current.innerText = item.contents;
            if (item.contents === "") {
                ref.current.focus();
            }
        }
    }, [item.contents]);
    (0, hooks_1.useKeyPress)((event) => {
        if (event.target === ref.current) {
            event.preventDefault();
            if (ref.current) {
                ref.current.blur();
            }
        }
    }, ["Enter"], false);
    (0, hooks_1.useKeyPress)((event) => {
        if (event.target === ref.current) {
            event.preventDefault();
            if (ref.current) {
                // Reset contents on escape
                ref.current.innerText = item.contents;
                ref.current.blur();
            }
        }
    }, ["Escape"], false);
    return (react_1.default.createElement("div", { className: "TodoItem" },
        react_1.default.createElement("span", { ref: ref, contentEditable: true, onBlur: (event) => onUpdate(event.currentTarget.innerText) }),
        react_1.default.createElement("div", { className: "controls" },
            react_1.default.createElement("a", { onClick: () => {
                    commitPendingEdit();
                    if (item.repeat && !item.completed) {
                        setShowMenu(true);
                    }
                    else {
                        onToggle();
                        setShowMenu(false);
                    }
                }, className: "complete" },
                react_1.default.createElement(shared_1.Icon, { name: item.completed ? "check-circle" : "circle" })),
            showMenu && item.repeat && !item.completed && (react_1.default.createElement("div", { className: "repeatMenu" },
                react_1.default.createElement("button", { onClick: () => {
                        commitPendingEdit();
                        onCompleteInstance();
                        setShowMenu(false);
                    } }, "Completed This Instance"),
                react_1.default.createElement("button", { onClick: () => {
                        commitPendingEdit();
                        onCompleteTask();
                        setShowMenu(false);
                    } }, "Complete Task"))),
            react_1.default.createElement("a", { onClick: onDelete, className: "delete" },
                react_1.default.createElement(shared_1.RemoveIcon, null)))));
};
exports.default = TodoItem;
//# sourceMappingURL=TodoItem.js.map