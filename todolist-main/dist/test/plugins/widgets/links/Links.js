"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const shared_1 = require("../../../views/shared");
const Display_1 = __importDefault(require("./Display"));
const types_1 = require("./types");
require("./Links.sass");
const Links = ({ data = types_1.defaultData }) => {
    const [visible, toggleVisible] = (0, hooks_1.useToggle)();
    (0, hooks_1.useKeyPress)(({ key }) => {
        const index = Number(key) - 1;
        if (data.links[index]) {
            data.linkOpenStyle
                ? window.open(data.links[index].url, "_blank")
                : window.location.assign(data.links[index].url);
        }
    }, ["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    return (react_1.default.createElement("div", { className: "Links", style: {
            gridTemplateColumns: data.visible || visible ? "1fr ".repeat(data.columns) : "1fr",
            textAlign: data.columns > 1 ? "left" : "inherit",
        } }, data.visible || visible ? (data.links.map((link, index) => (react_1.default.createElement(Display_1.default, Object.assign({ key: index, number: index + 1, linkOpenStyle: data.linkOpenStyle }, link))))) : (react_1.default.createElement("a", { onClick: toggleVisible, title: "Show quick links" },
        react_1.default.createElement(shared_1.Icon, { name: "link-2" })))));
};
exports.default = Links;
//# sourceMappingURL=Links.js.map