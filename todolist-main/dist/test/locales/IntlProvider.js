"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const state_1 = require("../db/state");
const react_2 = require("../lib/db/react");
const locales_1 = require("./locales");
const IntlProvider = ({ children }) => {
    const locale = (0, react_2.useValue)(state_1.db, "locale");
    return (react_1.default.createElement(react_intl_1.IntlProvider, { locale: locale, messages: locales_1.messages[locale] }, children));
};
exports.default = IntlProvider;
//# sourceMappingURL=IntlProvider.js.map