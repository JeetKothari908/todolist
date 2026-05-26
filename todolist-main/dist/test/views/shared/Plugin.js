"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_error_boundary_1 = require("react-error-boundary");
const errorHandler_1 = require("../../errorHandler");
const hooks_1 = require("../../hooks");
const Crashed_1 = __importDefault(require("./Crashed"));
const Plugin = ({ id, component: Component }) => {
    // Create plugin API
    const api = (0, hooks_1.useApi)(id);
    return react_1.default.createElement(Component, Object.assign({}, api));
};
exports.default = (0, react_error_boundary_1.withErrorBoundary)(Plugin, {
    FallbackComponent: Crashed_1.default,
    onError: errorHandler_1.capture,
});
//# sourceMappingURL=Plugin.js.map