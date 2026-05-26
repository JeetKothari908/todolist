"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiContext = void 0;
const react_1 = __importDefault(require("react"));
exports.UiContext = react_1.default.createContext({});
const UiProvider = ({ children }) => {
    const [state, setState] = react_1.default.useState({
        errors: false,
        pending: 0,
        settings: false,
    });
    const methods = react_1.default.useMemo(() => ({
        pushLoader: () => setState((state) => (Object.assign(Object.assign({}, state), { pending: state.pending + 1 }))),
        popLoader: () => setState((state) => (Object.assign(Object.assign({}, state), { pending: state.pending - 1 }))),
        toggleErrors: () => setState((state) => (Object.assign(Object.assign({}, state), { errors: !state.errors }))),
        toggleSettings: () => setState((state) => (Object.assign(Object.assign({}, state), { settings: !state.settings }))),
    }), []);
    return (react_1.default.createElement(exports.UiContext.Provider, { value: Object.assign(Object.assign({}, state), methods) }, children));
};
exports.default = UiProvider;
//# sourceMappingURL=ui.js.map