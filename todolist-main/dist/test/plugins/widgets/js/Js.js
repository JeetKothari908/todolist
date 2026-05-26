"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const types_1 = require("./types");
const Js = ({ data = types_1.defaultData }) => {
    (0, react_1.useEffect)(() => {
        const script = document.createElement("script");
        script.id = "CustomJs";
        script.type = "text/javascript";
        script.appendChild(document.createTextNode(data.input));
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, [data.input]);
    return null;
};
exports.default = Js;
//# sourceMappingURL=Js.js.map