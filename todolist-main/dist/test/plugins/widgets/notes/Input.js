"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const shared_1 = require("../../../views/shared");
const Input = (_a) => {
    var { onChange, value } = _a, props = __rest(_a, ["onChange", "value"]);
    const span = react_1.default.useRef(null);
    const [isEditing, setIsEditing] = react_1.default.useState(false);
    react_1.default.useLayoutEffect(() => {
        if (span.current)
            span.current.innerText = value;
    }, [value]);
    (0, hooks_1.useKeyPress)((event) => {
        if (event.target === span.current && span.current) {
            event.preventDefault();
            span.current.blur();
        }
    }, ["Escape"], false);
    const handleBlur = () => {
        if (span.current.innerText.trim() === "")
            span.current.innerText = "";
        if (span.current.innerText !== value)
            onChange(span.current.innerText);
        setIsEditing(false);
    };
    const handleFocus = () => {
        setIsEditing(true);
    };
    return (react_1.default.createElement("div", { style: { position: "relative" } },
        react_1.default.createElement("span", Object.assign({}, props, { style: Object.assign(Object.assign({}, props.style), { display: "block", position: !isEditing && value === "" ? "absolute" : "unset" }), ref: span, contentEditable: true, onBlur: handleBlur, onFocus: handleFocus })),
        isEditing ? (react_1.default.createElement("div", { style: { position: "absolute", top: "-1.25em", right: "0" } },
            react_1.default.createElement("a", null,
                react_1.default.createElement(shared_1.Icon, { name: "check" })))) : value === "" ? (react_1.default.createElement("a", { onClick: () => { var _a; return (_a = span.current) === null || _a === void 0 ? void 0 : _a.focus(); } },
            react_1.default.createElement(shared_1.Icon, { name: "edit" }))) : null));
};
exports.default = Input;
//# sourceMappingURL=Input.js.map