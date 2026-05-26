"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IpInfo_1 = __importDefault(require("./IpInfo"));
const IpInfoSettings_1 = __importDefault(require("./IpInfoSettings"));
const config = {
    key: "widget/ipInfo",
    name: "IP Info",
    description: "Displays data on your IP and location",
    dashboardComponent: IpInfo_1.default,
    settingsComponent: IpInfoSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map