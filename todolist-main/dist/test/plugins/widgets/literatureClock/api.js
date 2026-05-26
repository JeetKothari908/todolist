"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuoteByTimeCode = exports.getTimeCode = void 0;
const apiEndpoint = "https://raw.githubusercontent.com/lbngoc/literature-clock/master/docs/times";
// Get current time code
function getTimeCode(time) {
    const hour = time.getHours().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
}
exports.getTimeCode = getTimeCode;
// Get quote by time code
async function getQuoteByTimeCode(timeCode) {
    const res = await fetch(`${apiEndpoint}/${timeCode}.json`, { mode: "cors" });
    const body = await res.json();
    if (res.status === 429) {
        return {
            title: "Too many requests at this time",
        };
    }
    return body[Math.floor(Math.random() * body.length)];
}
exports.getQuoteByTimeCode = getQuoteByTimeCode;
//# sourceMappingURL=api.js.map