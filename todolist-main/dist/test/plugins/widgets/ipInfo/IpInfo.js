"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const api_1 = require("../../../api");
const api_2 = require("./api");
const types_1 = require("./types");
const IpInfo = ({ cache, data = types_1.defaultData, setCache, loader, }) => {
    const pushError = (0, api_1.usePushError)();
    react_1.default.useEffect(() => {
        (0, api_2.getIpInfo)(loader).then(setCache).catch(pushError);
    }, []);
    if (!cache) {
        return null;
    }
    const info = [cache.ip];
    if (data.displayCity)
        info.push(cache.city);
    if (data.displayCountry)
        info.push(cache.country);
    return react_1.default.createElement("div", { className: "IpInfo" }, info.join(", "));
};
exports.default = IpInfo;
//# sourceMappingURL=IpInfo.js.map