"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const Backdrop_1 = __importDefault(require("../../../views/shared/Backdrop"));
const api_1 = require("./api");
const Credit_1 = __importDefault(require("./Credit"));
require("./Giphy.sass");
const types_1 = require("./types");
const Giphy = ({ cache, data = types_1.defaultData, setCache, loader, }) => {
    const [gif, setGif] = react_1.default.useState(cache);
    const mounted = react_1.default.useRef(false);
    react_1.default.useEffect(() => {
        const config = { tag: data.tag, nsfw: data.nsfw };
        (0, api_1.getGif)(config, loader).then(setCache);
        if (mounted.current || !gif)
            (0, api_1.getGif)(config, loader).then(setGif);
        mounted.current = true;
    }, [data.tag, data.nsfw]);
    const url = (0, hooks_1.useObjectUrl)(gif && gif.data);
    if (!gif || !url)
        return null;
    return (react_1.default.createElement("div", { className: "Giphy fullscreen" },
        react_1.default.createElement(Backdrop_1.default, { className: "gif fullscreen", style: {
                backgroundImage: `url(${url})`,
                backgroundSize: data.expand ? "cover" : undefined,
            } }),
        react_1.default.createElement(Credit_1.default, { link: gif.link })));
};
exports.default = Giphy;
//# sourceMappingURL=Giphy.js.map