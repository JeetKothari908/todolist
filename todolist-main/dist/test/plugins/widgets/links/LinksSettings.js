"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const Input_1 = __importDefault(require("./Input"));
const actions_1 = require("./actions");
const reducer_1 = require("./reducer");
const types_1 = require("./types");
const LinksSettings = ({ data = types_1.defaultData, setData }) => {
    const saveLinks = (links) => setData(Object.assign(Object.assign({}, data), { links }));
    const [links, dispatch] = (0, hooks_1.useSavedReducer)(reducer_1.reducer, data.links, saveLinks);
    return (react_1.default.createElement("div", { className: "LinksSettings" },
        react_1.default.createElement("label", null,
            "Number of columns",
            react_1.default.createElement("input", { type: "number", value: data.columns, onChange: (event) => setData(Object.assign(Object.assign({}, data), { columns: Number(event.target.value) })), min: 1 })),
        react_1.default.createElement("label", null,
            react_1.default.createElement("input", { type: "checkbox", checked: data.visible, onChange: () => setData(Object.assign(Object.assign({}, data), { visible: !data.visible })) }),
            "Links are always visible"),
        react_1.default.createElement("label", null,
            react_1.default.createElement("input", { type: "checkbox", checked: data.linkOpenStyle, onChange: () => setData(Object.assign(Object.assign({}, data), { linkOpenStyle: !data.linkOpenStyle })) }),
            "Links open in a new tab"),
        react_1.default.createElement("hr", null),
        links.map((link, index) => (react_1.default.createElement(Input_1.default, Object.assign({}, link, { key: index, number: index + 1, onChange: (values) => dispatch((0, actions_1.updateLink)(index, Object.assign(Object.assign({}, link), values))), onMoveUp: index !== 0
                ? () => dispatch((0, actions_1.reorderLink)(index, index - 1))
                : undefined, onMoveDown: index !== links.length - 1
                ? () => dispatch((0, actions_1.reorderLink)(index, index + 1))
                : undefined, onRemove: () => dispatch((0, actions_1.removeLink)(index)) })))),
        react_1.default.createElement("p", { style: { marginTop: "0.5rem" } },
            react_1.default.createElement("button", { className: "button button--primary", onClick: () => dispatch((0, actions_1.addLink)()) }, "Add link"))));
};
exports.default = LinksSettings;
//# sourceMappingURL=LinksSettings.js.map