"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const state_1 = require("../../../db/state");
const hooks_1 = require("../../../hooks");
const react_2 = require("../../../lib/db/react");
const utils_1 = require("../../../utils");
const api_1 = require("./api");
const getPeriod_1 = require("./getPeriod");
require("./Nba.sass");
const types_1 = require("./types");
const EXPIRE_IN = 1 * utils_1.MINUTES;
const Nba = ({ cache, data = types_1.defaultData, setCache, loader, }) => {
    const timeZone = (0, react_2.useValue)(state_1.db, "timeZone");
    (0, hooks_1.useCachedEffect)(() => {
        (0, api_1.getCurrentGames)(loader).then(setCache);
    }, cache ? cache.timestamp + EXPIRE_IN : 0, []);
    if (!cache || cache.games.length < 1) {
        return react_1.default.createElement("div", null, "No games today");
    }
    return (react_1.default.createElement("div", { className: "nba-container" }, cache.games.map((game) => (react_1.default.createElement("div", { key: game.gameId, className: "nba-game" },
        react_1.default.createElement("div", { className: "period" }, (0, getPeriod_1.getPeriod)(game, timeZone)),
        react_1.default.createElement("div", null, data.displayLogo ? (react_1.default.createElement("img", { className: "icon", src: game.hTeam.logo })) : null),
        react_1.default.createElement("span", { className: "teams" },
            game.hTeam.triCode,
            " - ",
            game.vTeam.triCode),
        react_1.default.createElement("div", null, data.displayLogo ? (react_1.default.createElement("img", { className: "icon", src: game.vTeam.logo })) : null),
        react_1.default.createElement("div", { className: "score" }, game.period.current ? (react_1.default.createElement("span", null,
            game.hTeam.score,
            " ",
            game.vTeam.score)) : null))))));
};
exports.default = Nba;
//# sourceMappingURL=Nba.js.map