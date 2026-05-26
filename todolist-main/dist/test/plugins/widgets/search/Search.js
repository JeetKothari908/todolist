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
const react_1 = __importStar(require("react"));
const react_intl_1 = require("react-intl");
const getSuggestions_1 = require("./getSuggestions");
const Suggestions_1 = __importDefault(require("./Suggestions"));
const types_1 = require("./types");
const utils_1 = require("./utils");
require("./Search.sass");
const messages = (0, react_intl_1.defineMessages)({
    placeholder: {
        id: "plugins.search.placeholder",
        description: "Placeholder text to show in the search box before typing",
        defaultMessage: "Type to search",
    },
});
const Search = ({ data = types_1.defaultData }) => {
    const searchInput = (0, react_1.useRef)(null);
    const previousValue = (0, react_1.useRef)("");
    const [active, setActive] = (0, react_1.useState)();
    const [suggestions, setSuggestions] = (0, react_1.useState)();
    const intl = (0, react_intl_1.useIntl)();
    const placeholder = (0, react_1.useMemo)(() => intl.formatMessage(messages.placeholder), [intl]);
    const handleChange = (event) => {
        previousValue.current = event.target.value;
        if (BUILD_TARGET === "web") {
            const suggestUrl = (0, utils_1.getSuggestUrl)(data.suggestionsEngine);
            if (suggestUrl) {
                (0, getSuggestions_1.getSuggestions)(event.target.value, suggestUrl).then((suggestions) => {
                    setSuggestions(suggestions.slice(0, data.suggestionsQuantity));
                    setActive(undefined);
                });
            }
        }
    };
    const handleKeyUp = (event) => {
        if (!suggestions) {
            return;
        }
        event.preventDefault();
        switch (event.key) {
            case "ArrowUp":
                const upTo = !active ? suggestions.length - 1 : active - 1;
                searchInput.current.value = suggestions[upTo];
                setActive(upTo);
                break;
            case "ArrowDown":
                const downTo = active === undefined || active === suggestions.length - 1
                    ? 0
                    : active + 1;
                searchInput.current.value = suggestions[downTo];
                setActive(downTo);
                break;
            case "Escape":
                if (active) {
                    setActive(undefined);
                    searchInput.current.value = previousValue.current;
                }
                else if (suggestions) {
                    setSuggestions(undefined);
                }
                break;
        }
    };
    const handleSelect = (suggestion) => {
        searchInput.current.value = suggestion;
        search();
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        search();
    };
    const search = () => {
        document.location.assign((0, utils_1.buildUrl)(searchInput.current.value, (0, utils_1.getSearchUrl)(data.searchEngine)));
    };
    return (react_1.default.createElement("form", { className: "Search", onSubmit: handleSubmit },
        react_1.default.createElement("input", { autoFocus: true, defaultValue: "", placeholder: placeholder, ref: searchInput, tabIndex: 1, type: "text", onChange: handleChange, onKeyUp: handleKeyUp }),
        suggestions && (react_1.default.createElement(Suggestions_1.default, { active: active, setActive: setActive, suggestions: suggestions, onSelect: handleSelect }))));
};
exports.default = Search;
//# sourceMappingURL=Search.js.map