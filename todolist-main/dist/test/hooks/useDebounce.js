"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = void 0;
const react_1 = require("react");
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValued] = (0, react_1.useState)(value);
    (0, react_1.useEffect)(() => {
        const handler = setTimeout(() => {
            setDebouncedValued(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value]);
    return debouncedValue;
}
exports.useDebounce = useDebounce;
//# sourceMappingURL=useDebounce.js.map