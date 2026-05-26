"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSavedReducer = void 0;
const react_1 = require("react");
function useSavedReducer(reducer, initialState, save) {
    const [state, dispatch] = (0, react_1.useReducer)(reducer, initialState);
    const saveRef = (0, react_1.useRef)(save);
    saveRef.current = save;
    (0, react_1.useEffect)(() => {
        saveRef.current(state);
    }, [state]);
    return [state, dispatch];
}
exports.useSavedReducer = useSavedReducer;
//# sourceMappingURL=useSavedReducer.js.map