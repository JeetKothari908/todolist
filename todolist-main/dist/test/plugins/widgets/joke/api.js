"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJoke = void 0;
const url = "https://v2.jokeapi.dev/joke";
async function getJoke(categories, locale) {
    const languageUrlParameter = `lang=${locale}`;
    const safeModeUrlParameter = "safe-mode";
    const categoriesUrlParameter = Array.from(categories).join(",");
    const res = await fetch(
    // Note: We will always ask jokeapi to return safe jokes for everyone.
    // This is to comply with content policies (i.e. Hate speech) for all platforms.
    `${url}/${categoriesUrlParameter}?${safeModeUrlParameter}&${languageUrlParameter}`);
    const body = await res.json();
    return Object.assign(Object.assign({}, body), { timestamp: Date.now() });
}
exports.getJoke = getJoke;
//# sourceMappingURL=api.js.map