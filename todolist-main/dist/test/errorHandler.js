"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capture = exports.register = void 0;
const browser_1 = require("@sentry/browser");
function register() {
    (0, browser_1.init)({
        autoSessionTracking: false, // Wtf sentry
        dsn: "https://2e0e75c7477c4c3e9572ee97241e569c@o113629.ingest.sentry.io/250221",
        enabled: !DEV,
        release: VERSION,
    });
    (0, browser_1.setTag)("target", BUILD_TARGET);
}
exports.register = register;
function capture(error) {
    if (error.stack) {
        // Replace firefox extension URLs
        error.stack = error.stack.replace(/moz-extension:\/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, "resource://tabliss-extension");
        // Replace chrome extension URLs
        error.stack = error.stack.replace(/chrome-extension:\/\/hipekcciheckooncpjeljhnekcoolahp/g, "resource://tabliss-extension");
    }
    (0, browser_1.captureException)(error);
}
exports.capture = capture;
//# sourceMappingURL=errorHandler.js.map