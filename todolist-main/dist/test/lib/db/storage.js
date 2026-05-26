"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteSync = exports.extensionLocal = exports.extension = exports.indexeddb = void 0;
const DB = __importStar(require("./db"));
const Stream = __importStar(require("./stream"));
/** IndexedDB storage provider */
// TODO: clean up indexeddb usage, convert to promises and double check error handling
const indexeddb = (db, name) => {
    // Map idb errors to a standard format
    const mapError = (message, err) => {
        const cause = err instanceof Event &&
            err.target instanceof IDBRequest &&
            err.target.error instanceof Error
            ? err.target.error
            : undefined;
        return new StorageError(`IndexedDB: ${name}: ${message}`, { cause });
    };
    return new Promise((resolve, reject) => {
        const rejectError = (message) => (err) => {
            reject(mapError(message, err));
        };
        const open = indexedDB.open(name, 1);
        open.onerror = rejectError("Cannot open database");
        open.onupgradeneeded = () => {
            open.result.createObjectStore("changes");
        };
        open.onsuccess = () => {
            const conn = open.result;
            const trx = conn.transaction("changes", "readonly");
            trx.onerror = rejectError("Cannot read changes from store");
            const changes = [];
            const cursor = trx.objectStore("changes").openCursor();
            cursor.onsuccess = () => {
                if (cursor.result) {
                    if (typeof cursor.result.key === "string")
                        changes.push([cursor.result.key, cursor.result.value]);
                    cursor.result.continue();
                }
                else {
                    // Finished loading
                    DB.atomic(db, (trx) => {
                        changes.forEach(([key, val]) => DB.put(trx, key, val));
                    });
                    // Write
                    const errors = Stream.init();
                    DB.listen(db, batch((changes) => {
                        if (DEV)
                            console.log("Storage: saving changes:", changes);
                        const trx = conn.transaction("changes", "readwrite");
                        trx.oncomplete = () => { }; // nice
                        trx.onerror = (error) => Stream.publish(errors, mapError("Cannot write changes to store", error));
                        const store = trx.objectStore("changes");
                        // TODO: iterator helpers
                        for (const [key, val] of changes) {
                            if (val === undefined)
                                store.delete(key);
                            else
                                store.put(val, key);
                        }
                    }));
                    resolve(errors);
                }
            };
        };
    });
};
exports.indexeddb = indexeddb;
/** Web Extension storage provider */
const extension = async (db, name, area) => {
    // Map errors to a standard format
    const mapError = (message, err) => new StorageError(`Extension[${area}]: ${name}: ${message}`, {
        cause: err instanceof Error ? err : undefined,
    });
    const storageArea = browser.storage[area];
    // Pull
    await storageArea
        .get()
        .then((stored) => Object.keys(stored)
        .filter((key) => key.startsWith(name))
        .forEach((key) => DB.put(db, key.substring(name.length + 1), stored[key])))
        .catch((error) => {
        throw mapError("Cannot read from storage", error);
    });
    // Push
    const errors = Stream.init();
    const handleError = (message) => (err) => {
        Stream.publish(errors, mapError(message, err));
    };
    const write = createExtensionWriter(area);
    DB.listen(db, batch((changes) => {
        if (DEV)
            console.log("Storage: saving changes:", changes);
        // TODO: test for both updates and deletes for the same key
        // TODO: iterator helpers
        const changesArray = Array.from(changes);
        const updates = Object.fromEntries(changesArray
            .filter(([, val]) => val !== undefined)
            .map(([key, val]) => [`${name}/${key}`, val]));
        const deletes = changesArray
            .filter(([, val]) => val === undefined)
            .map(([key]) => `${name}/${key}`);
        if (Object.keys(updates).length > 0)
            write(() => storageArea.set(updates), handleError("Cannot write updates to storage"));
        if (deletes.length > 0)
            write(() => storageArea.remove(deletes), handleError("Cannot write deletes to storage"));
    }, area === "sync" ? syncBatchTimeout : 0));
    return errors;
};
exports.extension = extension;
/** Web Extension local storage provider with one-time sync import */
const extensionLocal = async (db, name) => {
    const localStored = await browser.storage.local.get();
    const localHasConfig = Object.keys(localStored).some((key) => key.startsWith(name));
    if (!localHasConfig) {
        const syncStored = await browser.storage.sync.get();
        const syncConfig = Object.fromEntries(Object.entries(syncStored).filter(([key]) => key.startsWith(name)));
        if (Object.keys(syncConfig).length > 0)
            await browser.storage.local.set(syncConfig);
    }
    return (0, exports.extension)(db, name, "local");
};
exports.extensionLocal = extensionLocal;
/** Remote HTTP sync provider */
const remoteSync = async (db, name, options) => {
    const baseUrl = options.url.replace(/\/$/, "");
    const errors = Stream.init();
    const mapError = (message, err) => new StorageError(`Remote sync: ${name}: ${message}`, {
        cause: err instanceof Error ? err : undefined,
    });
    const storePath = name.split("/").map(encodeURIComponent).join("/");
    const headers = {
        "content-type": "application/json",
    };
    if (options.token)
        headers.authorization = `Bearer ${options.token}`;
    const request = async (path, init) => {
        console.info("[todo-sync] request:", (init === null || init === void 0 ? void 0 : init.method) || "GET", path);
        const res = await fetch(`${baseUrl}${path}`, Object.assign(Object.assign({}, init), { headers: Object.assign(Object.assign({}, headers), init === null || init === void 0 ? void 0 : init.headers) }));
        if (!res.ok)
            throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
    };
    try {
        console.info("[todo-sync] starting remote sync:", baseUrl);
        const snapshot = await request(`/v1/stores/${storePath}`);
        console.info("[todo-sync] remote changes:", snapshot.changes.length);
        if (snapshot.changes.length === 0) {
            const seedChanges = [];
            for (const [key, value] of db) {
                if (value !== undefined)
                    seedChanges.push({ key, value });
            }
            await request(`/v1/stores/${storePath}/changes`, {
                method: "POST",
                body: JSON.stringify({
                    changes: seedChanges,
                }),
            });
            console.info("[todo-sync] seeded remote changes:", seedChanges.length);
        }
        else {
            DB.atomic(db, (trx) => {
                for (const change of snapshot.changes) {
                    if (change.deleted)
                        DB.del(trx, change.key);
                    else
                        DB.put(trx, change.key, change.value);
                }
            });
        }
    }
    catch (error) {
        const syncError = mapError("Cannot sync initial snapshot", error);
        console.error(syncError);
        setTimeout(() => Stream.publish(errors, syncError), 0);
    }
    DB.listen(db, batch((changes) => {
        const body = {
            changes: Array.from(changes).map(([key, value]) => value === undefined ? { key, deleted: true } : { key, value }),
        };
        console.info("[todo-sync] pushing local changes:", body.changes.length);
        request(`/v1/stores/${storePath}/changes`, {
            method: "POST",
            body: JSON.stringify(body),
        }).catch((error) => Stream.publish(errors, mapError("Cannot push local changes", error)));
    }, remoteSyncBatchTimeout));
    return errors;
};
exports.remoteSync = remoteSync;
const syncBatchTimeout = 1500;
const syncWriteInterval = 3000;
const syncQuotaRetryTimeout = 60 * 1000;
const remoteSyncBatchTimeout = 1000;
const createExtensionWriter = (area) => {
    if (area !== "sync")
        return (write, handleError) => write().catch(handleError);
    let queue = Promise.resolve();
    let lastWrite = 0;
    return (write, handleError) => {
        const run = async () => {
            const wait = Math.max(0, lastWrite + syncWriteInterval - Date.now());
            if (wait)
                await delay(wait);
            try {
                await write();
                lastWrite = Date.now();
            }
            catch (error) {
                if (isSyncQuotaError(error)) {
                    await delay(syncQuotaRetryTimeout);
                    return run();
                }
                throw error;
            }
        };
        queue = queue.then(run, run).catch(handleError);
    };
};
const isSyncQuotaError = (error) => error instanceof Error &&
    error.message.includes("MAX_WRITE_OPERATIONS_PER_MINUTE");
const delay = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));
const batch = (flush, timeout = 0) => {
    const changes = new Map();
    let timer = null;
    const run = () => {
        flush(changes);
        changes.clear();
        timer = null;
    };
    // If there are pending changes on browser close, flush immediately
    window.addEventListener("beforeunload", () => {
        if (timer) {
            clearTimeout(timer);
            run();
        }
    });
    return ([key, val]) => {
        changes.set(key, val);
        if (!timer)
            timer = setTimeout(run, timeout);
    };
};
/** Storage Error */
class StorageError extends Error {
    constructor() {
        super(...arguments);
        this.name = "StorageError";
    }
}
//# sourceMappingURL=storage.js.map