"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultData = exports.isJokeError = exports.isTwoPartJoke = exports.isSingleJoke = void 0;
const utils_1 = require("../../../utils");
function isSingleJoke(joke) {
    return !joke.error && joke.type === "single";
}
exports.isSingleJoke = isSingleJoke;
function isTwoPartJoke(joke) {
    return !joke.error && joke.type === "twopart";
}
exports.isTwoPartJoke = isTwoPartJoke;
function isJokeError(joke) {
    return joke.error;
}
exports.isJokeError = isJokeError;
exports.defaultData = {
    categories: new Set(["any"]),
    timeout: 5 * utils_1.MINUTES,
};
//# sourceMappingURL=types.js.map