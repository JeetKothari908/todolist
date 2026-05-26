"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTM = void 0;
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const shared_1 = require("../../../views/shared");
exports.UTM = "?utm_source=Start&utm_medium=referral&utm_campaign=api-credit";
const UnsplashCredit = ({ credit, paused, onPause, onPrev, onNext, }) => (react_1.default.createElement("div", { className: "credit" },
    react_1.default.createElement("div", { className: "photo" },
        react_1.default.createElement("a", { href: credit.imageLink + exports.UTM, rel: "noopener noreferrer" },
            react_1.default.createElement(react_intl_1.FormattedMessage, { id: "plugins.unsplash.photoLink", description: "Photo link text", defaultMessage: "Photo" })),
        ", ",
        react_1.default.createElement("a", { href: credit.userLink + exports.UTM, rel: "noopener noreferrer" }, credit.userName),
        ", ",
        react_1.default.createElement("a", { href: "https://unsplash.com/" + exports.UTM, rel: "noopener noreferrer" }, "Unsplash")),
    react_1.default.createElement("div", { className: "controls" },
        react_1.default.createElement("a", { className: onPrev ? "" : "hidden", onClick: onPrev !== null && onPrev !== void 0 ? onPrev : undefined },
            react_1.default.createElement(shared_1.Icon, { name: "arrow-left" })),
        " ",
        react_1.default.createElement("a", { onClick: onPause },
            react_1.default.createElement(shared_1.Icon, { name: paused ? "play" : "pause" })),
        " ",
        react_1.default.createElement("a", { className: onNext ? "" : "hidden", onClick: onNext !== null && onNext !== void 0 ? onNext : undefined },
            react_1.default.createElement(shared_1.Icon, { name: "arrow-right" }))),
    react_1.default.createElement("div", { className: "location" }, credit.location)));
exports.default = react_1.default.memo(UnsplashCredit);
//# sourceMappingURL=UnsplashCredit.js.map