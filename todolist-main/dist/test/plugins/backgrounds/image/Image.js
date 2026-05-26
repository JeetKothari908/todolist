"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const Backdrop_1 = __importDefault(require("../../../views/shared/Backdrop"));
require("./Image.sass");
const types_1 = require("./types");
const Image = ({ cache = types_1.defaultCache }) => {
    const index = react_1.default.useMemo(() => Math.floor(Math.random() * cache.length), [cache.length]);
    const url = (0, hooks_1.useObjectUrl)(cache[index]);
    if (!url)
        return react_1.default.createElement("div", { className: "Image default fullscreen" });
    return (react_1.default.createElement(Backdrop_1.default, { className: "Image fullscreen", style: { backgroundImage: url ? `url(${url})` : undefined } }));
};
exports.default = Image;
//# sourceMappingURL=Image.js.map