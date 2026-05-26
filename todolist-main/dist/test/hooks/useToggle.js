"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToggle = void 0;
const react_1 = require("react");
function useToggle(defaultState = false) {
    const [state, setState] = (0, react_1.useState)(defaultState);
    const toggle = () => setState(!state);
    return [state, toggle];
}
exports.useToggle = useToggle;
//# sourceMappingURL=useToggle.js.map