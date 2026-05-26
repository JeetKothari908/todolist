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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKey = exports.useSelector = exports.useValue = void 0;
const react_1 = __importDefault(require("react"));
const DB = __importStar(require("./db"));
/** Use a value from the database. */
const useValue = (db, key) => {
    return react_1.default.useSyncExternalStore(react_1.default.useCallback((listener) => DB.listen(db, ([changeKey]) => {
        if (changeKey === key)
            listener();
    }), [db, key]), react_1.default.useCallback(() => DB.get(db, key), [db, key]));
};
exports.useValue = useValue;
/**
 * Use a selector that reruns when the database changes.
 * @experimental may track keys in future
 */
const useSelector = (db, selector) => {
    // return React.useSyncExternalStore(
    //   React.useCallback((listener) => DB.listen(db, listener), [db]),
    //   selector,
    // );
    const [state, setState] = react_1.default.useState(selector);
    react_1.default.useEffect(() => {
        setState(selector());
        return DB.listen(db, () => {
            setState(selector());
        });
    }, [db, selector, setState]);
    return state;
};
exports.useSelector = useSelector;
/**
 * Use a key from the database.
 * @experimental may be removed from core, may be kept if providers come in
 */
const useKey = (db, key) => {
    return [(0, exports.useValue)(db, key), (val) => DB.put(db, key, val)];
};
exports.useKey = useKey;
//# sourceMappingURL=react.js.map