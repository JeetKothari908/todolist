"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Quote_1 = __importDefault(require("./Quote"));
const QuoteSettings_1 = __importDefault(require("./QuoteSettings"));
const config = {
    key: "widget/quote",
    name: "Quotes",
    description: "Be inspired (or not, there's categories).",
    dashboardComponent: Quote_1.default,
    settingsComponent: QuoteSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map