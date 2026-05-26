"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const Backdrop_1 = __importDefault(require("../../../views/shared/Backdrop"));
const api_1 = require("./api");
const types_1 = require("./types");
require("./Unsplash.sass");
const UnsplashCredit_1 = __importDefault(require("./UnsplashCredit"));
const Unsplash = ({ cache, data = types_1.defaultData, loader, setCache, setData, }) => {
    var _a;
    // If legacy cache design, clear and let the new cache take over
    // Unfortunately, without the image src being stored, I cannot migrate the old cache
    if (cache && "now" in cache) {
        cache = undefined;
    }
    // Migrate old pause setting
    react_1.default.useEffect(() => {
        if (data.timeout === Number.MAX_SAFE_INTEGER) {
            setData(Object.assign(Object.assign({}, data), { paused: true, timeout: types_1.defaultData.timeout }));
        }
    }, []);
    // Get current item from rotating cache
    const item = (0, hooks_1.useRotatingCache)(() => {
        loader.push();
        return (0, api_1.fetchImages)(data).finally(loader.pop);
    }, { cache, setCache }, data.paused ? Number.MAX_SAFE_INTEGER : data.timeout * 1000, [data.by, data.collections, data.featured, data.search, data.topics]);
    // Populate browser cache with the next image
    react_1.default.useEffect(() => {
        if (cache && cache.items[cache.cursor + 1]) {
            const next = new Image();
            next.src = (0, api_1.buildLink)(cache.items[cache.cursor + 1].src);
            next.onload = loader.pop;
            next.onerror = loader.pop;
            loader.push();
        }
    }, [cache]);
    const url = item ? (0, api_1.buildLink)(item.src) : null;
    const go = (amount) => cache && cache.items[cache.cursor + amount]
        ? () => setCache(Object.assign(Object.assign({}, cache), { cursor: cache.cursor + amount, rotated: Date.now() }))
        : null;
    const handlePause = () => {
        setData(Object.assign(Object.assign({}, data), { paused: !data.paused }));
    };
    return (react_1.default.createElement("div", { className: "Unsplash fullscreen" },
        react_1.default.createElement(Backdrop_1.default, { className: "image fullscreen", ready: url !== null, style: { backgroundImage: url ? `url(${url})` : undefined } }),
        item ? (react_1.default.createElement(UnsplashCredit_1.default, { credit: item.credit, paused: (_a = data.paused) !== null && _a !== void 0 ? _a : false, onPause: handlePause, onPrev: go(-1), onNext: go(1) })) : null));
};
exports.default = Unsplash;
//# sourceMappingURL=Unsplash.js.map