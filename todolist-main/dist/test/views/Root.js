"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const error_1 = __importDefault(require("../contexts/error"));
const time_1 = __importDefault(require("../contexts/time"));
const ui_1 = __importDefault(require("../contexts/ui"));
const IntlProvider_1 = __importDefault(require("../locales/IntlProvider"));
const App_1 = __importDefault(require("./App"));
const Root = () => (react_1.default.createElement(react_1.default.StrictMode, null,
    react_1.default.createElement(error_1.default, null,
        react_1.default.createElement(ui_1.default, null,
            react_1.default.createElement(IntlProvider_1.default, null,
                react_1.default.createElement(time_1.default, null,
                    react_1.default.createElement(App_1.default, null)))))));
exports.default = Root;
//# sourceMappingURL=Root.js.map