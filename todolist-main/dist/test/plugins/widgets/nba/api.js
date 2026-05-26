"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentGames = void 0;
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const query_1 = require("./query");
function getEstString(date) {
    const dateUTC = (0, date_fns_tz_1.zonedTimeToUtc)((0, date_fns_1.startOfDay)(date), Intl.DateTimeFormat().resolvedOptions().timeZone);
    const dateEST = (0, date_fns_tz_1.utcToZonedTime)(dateUTC, "EST");
    return (0, date_fns_tz_1.format)(dateEST, "yyyyMMdd");
}
async function getCurrentGames(loader) {
    loader.push();
    const { data } = await fetch("https://nba.rickyg.io/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: (0, query_1.gameQuery)(getEstString(new Date())) }),
    })
        .then((res) => res.json())
        .finally(() => loader.pop());
    return { timestamp: Date.now(), games: data ? data.schedule : [] };
}
exports.getCurrentGames = getCurrentGames;
//# sourceMappingURL=api.js.map