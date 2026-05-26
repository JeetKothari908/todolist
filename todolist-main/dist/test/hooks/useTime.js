"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTime = void 0;
const react_1 = require("react");
const time_1 = require("../contexts/time");
function useTime(type = "zoned") {
    return (0, react_1.useContext)(time_1.TimeContext)[type];
}
exports.useTime = useTime;
//# sourceMappingURL=useTime.js.map