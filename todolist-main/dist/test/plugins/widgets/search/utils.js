"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestUrl = exports.getSearchUrl = exports.buildUrl = void 0;
const tlds_1 = __importDefault(require("tlds"));
const engines_1 = require("./engines");
// TODO: Add unit tests
function buildUrl(query, engineUrl) {
    // See if they have started with a web scheme
    if (/^https?:\/\/\w+/.test(query)) {
        return query;
    }
    // See if they have ended with a valid TLD
    if (tlds_1.default.some((tld) => query.endsWith(`.${tld}`)) && !query.includes(" ")) {
        return `https://${query}`;
    }
    // Probably searching then
    return engineUrl.replace("{searchTerms}", encodeURIComponent(query));
}
exports.buildUrl = buildUrl;
function getSearchUrl(key) {
    const engine = engines_1.engines.find((engine) => engine.key === key);
    return (engine || engines_1.engines[0]).search_url;
}
exports.getSearchUrl = getSearchUrl;
function getSuggestUrl(key) {
    const engine = engines_1.engines.find((engine) => engine.key === key);
    return engine ? engine.suggest_url : undefined;
}
exports.getSuggestUrl = getSuggestUrl;
//# sourceMappingURL=utils.js.map