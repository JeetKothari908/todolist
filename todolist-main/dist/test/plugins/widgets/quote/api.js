"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuote = void 0;
const quotes_1 = require("./quotes");
async function getQuote(loader, _category) {
    loader.push();
    const today = new Date();
    const dayKey = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const dayIndex = Math.floor(dayKey / 86400000);
    const quoteIndex = Math.abs(dayIndex) % quotes_1.quotes.length;
    const data = quotes_1.quotes[quoteIndex];
    loader.pop();
    return {
        author: data.author,
        quote: cleanQuote(data.quote),
        timestamp: Date.now(),
    };
}
exports.getQuote = getQuote;
function cleanQuote(quote) {
    quote = quote.trim();
    const spaces = new RegExp(/\s{2,}/, "g");
    quote = quote.replace(spaces, " ");
    return quote;
}
//# sourceMappingURL=api.js.map