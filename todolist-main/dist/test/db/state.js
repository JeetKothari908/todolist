"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheStorage = exports.dbStorage = exports.cache = exports.db = void 0;
const lib_1 = require("../lib");
const locales_1 = require("../locales");
// Init data for the store
const initData = {
    background: {
        id: "default-wallpapers",
        key: "background/wallpapers",
        display: {
            luminosity: -0.2,
            blur: 0,
        },
    },
    "widget/default-time": {
        id: "default-time",
        key: "widget/time",
        order: 0,
        display: {
            position: "middleCentre",
        },
    },
    "widget/default-search": {
        id: "default-search",
        key: "widget/search",
        order: 1,
        display: {
            position: "middleCentre",
        },
    },
    "widget/default-quote": {
        id: "default-quote",
        key: "widget/quote",
        order: 2,
        display: {
            position: "middleCentre",
        },
    },
    "widget/default-todo": {
        id: "default-todo",
        key: "widget/todo",
        order: 3,
        display: {
            position: "bottomRight",
        },
    },
    focus: false,
    locale: locales_1.defaultLocale,
    timeZone: null,
    showQuotes: true,
};
// Database storage
exports.db = lib_1.DB.init(initData);
// Cache storage
exports.cache = lib_1.DB.init();
// Persist data
const localDbStorage = BUILD_TARGET === "web"
    ? lib_1.Storage.indexeddb(exports.db, "tabliss/config")
    : lib_1.Storage.extensionLocal(exports.db, "tabliss/config");
exports.dbStorage = localDbStorage.then(async (localErrors) => {
    if (!SYNC_SERVER_URL) {
        console.info("[todo-sync] disabled: SYNC_SERVER_URL is empty");
        return localErrors;
    }
    console.info("[todo-sync] enabled:", SYNC_SERVER_URL);
    const remoteErrors = await lib_1.Storage.remoteSync(exports.db, "tabliss/config", {
        url: SYNC_SERVER_URL,
        token: SYNC_AUTH_TOKEN || undefined,
    });
    const errors = lib_1.Stream.init();
    lib_1.Stream.subscribe(localErrors, (error) => lib_1.Stream.publish(errors, error));
    lib_1.Stream.subscribe(remoteErrors, (error) => lib_1.Stream.publish(errors, error));
    return errors;
});
exports.cacheStorage = BUILD_TARGET === "firefox"
    ? lib_1.Storage.extension(exports.cache, "tabliss/cache", "local")
    : lib_1.Storage.indexeddb(exports.cache, "tabliss/cache");
//# sourceMappingURL=state.js.map