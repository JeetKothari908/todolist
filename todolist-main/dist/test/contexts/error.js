"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePushError = exports.ErrorContext = void 0;
const react_1 = __importDefault(require("react"));
exports.ErrorContext = react_1.default.createContext(null);
const ErrorProvider = ({ children }) => {
    const [state, setState] = react_1.default.useState({ errors: [] });
    const push = react_1.default.useCallback((error) => setState((state) => (Object.assign(Object.assign({}, state), { errors: state.errors.concat(error) }))), [setState]);
    return (react_1.default.createElement(exports.ErrorContext.Provider, { value: Object.assign(Object.assign({}, state), { push }) }, children));
};
/** Push error to the error log */
const usePushError = () => react_1.default.useContext(exports.ErrorContext).push;
exports.usePushError = usePushError;
exports.default = ErrorProvider;
//# sourceMappingURL=error.js.map