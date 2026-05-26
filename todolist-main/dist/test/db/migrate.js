"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = void 0;
const lib_1 = require("../lib");
const action_1 = require("./action");
const select_1 = require("./select");
const state_1 = require("./state");
/** Migrate extension data */
const migrateExtension = async () => {
    const key = "persist:data";
    const stored = await browser.storage.sync.get(key);
    if (stored[key]) {
        // Migrate if new database is empty
        if (state_1.db.cache.size === 0) {
            (0, action_1.importStore)(stored[key]);
            migrateCache();
            clearDangling();
        }
        await browser.storage.sync.remove(key);
    }
    ensureQuoteWidget();
};
/** Migrate web data */
const migrateWeb = async () => {
    const key = "tabliss/data/persist:data";
    const data = localStorage.getItem(key);
    if (data) {
        // Migrate if new database is empty
        if (state_1.db.cache.size === 0) {
            try {
                (0, action_1.importStore)(JSON.parse(data));
                migrateCache();
                clearDangling();
            }
            catch (_a) { }
        }
        localStorage.removeItem(key);
    }
    ensureQuoteWidget();
};
/** Check and migrate data */
exports.migrate = BUILD_TARGET === "web" ? migrateWeb : migrateExtension;
/** Migrate cache data */
const migrateCache = () => {
    const open = indexedDB.open("tabliss", 3);
    open.onerror = console.error;
    open.onsuccess = () => {
        const read = open.result
            .transaction("cache")
            .objectStore("cache")
            .get("persist:cache");
        read.onerror = console.error;
        read.onsuccess = () => {
            const data = read.result;
            const used = findUsedIds();
            for (const id of used) {
                if (id in data)
                    lib_1.DB.put(state_1.cache, id, data[id]);
            }
            // For unexplained reasons this needs to be in a timeout
            setTimeout(() => {
                open.result.close();
                indexedDB.deleteDatabase("tabliss");
            });
        };
    };
};
/** Find all used plugin IDs in the database */
const findUsedIds = () => {
    const used = new Set();
    used.add(lib_1.DB.get(state_1.db, "background").id);
    for (const [, val] of lib_1.DB.prefix(state_1.db, "widget/")) {
        if (val !== null)
            used.add(val.id);
    }
    return used;
};
const ensureQuoteWidget = () => {
    const hasQuote = Array.from(lib_1.DB.prefix(state_1.db, "widget/")).some(([, val]) => val !== null && val.key === "widget/quote");
    if (hasQuote)
        return;
    const widgets = (0, select_1.selectWidgets)();
    const order = widgets.length > 0 ? widgets[widgets.length - 1].order + 1 : 0;
    lib_1.DB.put(state_1.db, "widget/default-quote", {
        id: "default-quote",
        key: "widget/quote",
        order,
        display: { position: "middleCentre" },
    });
};
/** Find and remove dangling data stored from previous versions */
const clearDangling = () => {
    const used = findUsedIds();
    for (const [key] of lib_1.DB.prefix(state_1.db, "data/")) {
        if (!used.has(key.substring(5)))
            lib_1.DB.del(state_1.db, key);
    }
    for (const [key] of state_1.cache) {
        if (!used.has(key))
            lib_1.DB.del(state_1.cache, key);
    }
};
//# sourceMappingURL=migrate.js.map