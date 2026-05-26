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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const hooks_1 = require("../../../hooks");
const state_1 = require("../../../db/state");
const react_2 = require("../../../lib/db/react");
const api_1 = require("./api");
require("./Joke.sass");
const types_1 = require("./types");
const Joke = ({ cache, data = types_1.defaultData, setCache, loader, }) => {
    // Grab the user's locale
    const locale = (0, react_2.useValue)(state_1.db, "locale");
    // Map to supported language
    const mapLocaleToJokeAPILang = (locale) => {
        const defaultLanguage = "en";
        const supportedLanguages = ["cs", "de", "en", "es", "fr", "pt"];
        const [lang] = locale.split("-");
        return supportedLanguages.includes(lang) ? lang : defaultLanguage;
    };
    (0, hooks_1.useCachedEffect)(() => {
        loader.push();
        const apiLocale = mapLocaleToJokeAPILang(locale);
        (0, api_1.getJoke)(data.categories, apiLocale).then(setCache).finally(loader.pop);
    }, (cache === null || cache === void 0 ? void 0 : cache.timestamp) ? cache.timestamp + data.timeout : 0, [data.categories]);
    if (!cache) {
        return null;
    }
    if ((0, types_1.isJokeError)(cache)) {
        return (react_1.default.createElement(react_1.default.Fragment, null, cache.causedBy.map((errorMessage, index) => {
            return react_1.default.createElement("p", { key: index }, errorMessage);
        })));
    }
    return (react_1.default.createElement("div", { className: "joke-container" },
        (0, types_1.isSingleJoke)(cache) && react_1.default.createElement("h5", null, cache.joke),
        (0, types_1.isTwoPartJoke)(cache) && react_1.default.createElement(TwoPartJoke, { joke: cache })));
};
const TwoPartJoke = ({ joke }) => {
    const isJokeAQuestion = joke.setup.slice(-1) === "?";
    const [showAnswer, setShowAnswer] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setShowAnswer(false);
    }, [joke]);
    if (!isJokeAQuestion) {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("h5", null, joke.setup),
            react_1.default.createElement("h5", null, joke.delivery)));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h5", { className: "question-joke-setup", onClick: () => setShowAnswer(!showAnswer) }, joke.setup),
        showAnswer && (react_1.default.createElement("h5", { className: "question-joke-delivery" }, joke.delivery))));
};
exports.default = Joke;
//# sourceMappingURL=Joke.js.map