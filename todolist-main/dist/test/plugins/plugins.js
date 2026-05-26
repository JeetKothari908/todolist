"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigSafe = exports.getConfig = exports.widgetConfigs = exports.backgroundConfigs = void 0;
const backgrounds_1 = require("./backgrounds");
const widgets_1 = require("./widgets");
var backgrounds_2 = require("./backgrounds");
Object.defineProperty(exports, "backgroundConfigs", { enumerable: true, get: function () { return backgrounds_2.backgroundConfigs; } });
var widgets_2 = require("./widgets");
Object.defineProperty(exports, "widgetConfigs", { enumerable: true, get: function () { return widgets_2.widgetConfigs; } });
const configs = [...backgrounds_1.backgroundConfigs, ...widgets_1.widgetConfigs];
function getConfig(key) {
    const config = getConfigSafe(key);
    if (!config)
        throw new Error(`Unable to find config for plugin: ${key}`);
    return config;
}
exports.getConfig = getConfig;
function getConfigSafe(key) {
    var _a;
    return (_a = configs.find((config) => config.key === key)) !== null && _a !== void 0 ? _a : null;
}
exports.getConfigSafe = getConfigSafe;
//# sourceMappingURL=plugins.js.map