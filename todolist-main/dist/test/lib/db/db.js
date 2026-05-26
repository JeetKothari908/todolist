"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomic = exports.listen = exports.del = exports.put = exports.prefix = exports.get = exports.init = void 0;
/**
 * Init a new database.
 */
const init = (def) => {
    return Object.assign({ listeners: new Set() }, snapshot(def ? snapshot(null, Object.entries(def)) : null));
};
exports.init = init;
/**
 * Get a value from a key in the database.
 * WARNING: These types can lie to you. Without schema support, invalid data may be saved in storage.
 */
const get = (db, key) => {
    // @ts-ignore
    if (db.cache.has(key))
        return db.cache.get(key);
    if (db.parent)
        return (0, exports.get)(db.parent, key);
    // @ts-ignore
    return undefined;
    // TODO: consider throwing, may require tombstones to work correctly
    // throw new NotFoundError(key);
};
exports.get = get;
/**
 * Iterate over key-value pairs for keys beginning with the prefix.
 */
const prefix = function* (db, path, seen = new Set()) {
    for (const [key, val] of db.cache) {
        if (key.startsWith(path)) {
            if (seen.has(key))
                continue;
            seen.add(key);
            // @ts-ignore
            yield [key, val];
        }
    }
    if (db.parent)
        yield* (0, exports.prefix)(db.parent, path, seen);
};
exports.prefix = prefix;
/**
 * Put a value into a key in the database.
 */
const put = (db, key, val) => {
    db.cache.set(key, val);
    if ("listeners" in db)
        db.listeners.forEach((listener) => listener([key, val]));
};
exports.put = put;
/**
 * Delete a key from the database.
 */
const del = (db, key) => {
    if ("listeners" in db) {
        // TODO: This is here because of the interaction with def data, consider changing
        db.cache.delete(key);
        db.listeners.forEach((listener) => listener([key, undefined]));
    }
    else {
        db.cache.set(key, undefined);
    }
};
exports.del = del;
/**
 * Listen to changes in the database.
 */
const listen = (db, listener) => {
    db.listeners.add(listener);
    return () => db.listeners.delete(listener);
};
exports.listen = listen;
/**
 * Commits all writes or none if an error is thrown in provided function.
 * does provide atomic writes
 * does provide write isolation
 * does not provide read isolation
 * @experimental
 */
const atomic = (db, fn) => {
    const snap = snapshot(db);
    fn(snap);
    commit(db, snap.cache.entries());
};
exports.atomic = atomic;
const snapshot = (parent = null, changes) => {
    const cache = new Map(changes);
    return {
        cache,
        parent,
        [Symbol.iterator]: cache[Symbol.iterator].bind(cache),
    };
};
const commit = (db, changes) => {
    for (const [key, val] of changes) {
        (0, exports.put)(db, key, val);
    }
};
//# sourceMappingURL=db.js.map