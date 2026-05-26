"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeContext = void 0;
const date_fns_tz_1 = require("date-fns-tz");
const react_1 = __importDefault(require("react"));
const state_1 = require("../db/state");
const react_2 = require("../lib/db/react");
function getTime(timeZone = null) {
    const absolute = new Date();
    const zoned = timeZone ? (0, date_fns_tz_1.utcToZonedTime)(absolute, timeZone) : absolute;
    return { absolute, zoned };
}
// `defaultValue` here is irrelevant as it will be replaced in the provider
exports.TimeContext = react_1.default.createContext(getTime());
const TimeProvider = ({ children }) => {
    const timeZone = (0, react_2.useValue)(state_1.db, "timeZone");
    const [time, setTime] = react_1.default.useState(getTime(timeZone));
    react_1.default.useEffect(() => {
        setTime(getTime(timeZone));
        const interval = setInterval(() => setTime(getTime(timeZone)), 1000);
        return () => clearInterval(interval);
    }, [timeZone]);
    return react_1.default.createElement(exports.TimeContext.Provider, { value: time }, children);
};
exports.default = TimeProvider;
//# sourceMappingURL=time.js.map