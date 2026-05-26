"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyPress = void 0;
const react_1 = require("react");
function isInputEvent(event) {
    return (event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLSpanElement &&
            Boolean(event.target.contentEditable)));
}
function useKeyPress(callback, detectKeys, ignoreInputEvents = true) {
    const handler = (event) => {
        if (detectKeys.includes(event.key) &&
            !(ignoreInputEvents && isInputEvent(event)) &&
            !(event.ctrlKey || event.metaKey || event.altKey)) {
            callback(event);
        }
    };
    (0, react_1.useEffect)(() => {
        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, [ignoreInputEvents, callback]);
}
exports.useKeyPress = useKeyPress;
//# sourceMappingURL=useKeyPress.js.map