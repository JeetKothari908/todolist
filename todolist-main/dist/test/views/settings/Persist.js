"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Persist = () => {
    const [error, setError] = react_1.default.useState(false);
    const [persisted, setPersisted] = react_1.default.useState(true); // Hide until we know otherwise
    react_1.default.useEffect(() => {
        if (navigator.storage)
            navigator.storage.persisted().then(setPersisted);
    }, []);
    if (persisted)
        return null;
    const handleClick = () => {
        navigator.storage
            .persist()
            .then((persisted) => persisted ? setPersisted(persisted) : setError(true));
    };
    return (react_1.default.createElement("div", { className: "Widget", style: { textAlign: "center" } },
        react_1.default.createElement("h4", null, "Persist Settings"),
        react_1.default.createElement("p", null, "Would you like Tabliss to ask your browser to save your setting permanently?"),
        error ? (react_1.default.createElement("p", null, "Could not persist settings at this time.")) : (react_1.default.createElement("button", { className: "button button--primary", onClick: handleClick }, "Persist Settings"))));
};
exports.default = Persist;
//# sourceMappingURL=Persist.js.map