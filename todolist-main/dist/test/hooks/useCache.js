"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRotatingCache = exports.useCachedEffect = void 0;
const react_1 = require("react");
const useTime_1 = require("./useTime");
/**
 * A cached effect that automatically reruns after the expires time or on deps change.
 */
function useCachedEffect(effect, expires, deps) {
    const time = (0, useTime_1.useTime)("absolute");
    const prevDeps = (0, react_1.useRef)(deps);
    const prevExpires = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        const depsChanged = !areDepsEqual(prevDeps.current, deps);
        const expired = time >= expires && expires !== prevExpires.current;
        if (depsChanged || expired) {
            prevDeps.current = deps;
            prevExpires.current = expires;
            return effect();
        }
    }, [...deps, expires, time]);
}
exports.useCachedEffect = useCachedEffect;
/**
 * A cache which rotates through a list of items
 */
function useRotatingCache(fetch, { cache, setCache }, timeout, deps) {
    // Find cursor
    const time = (0, useTime_1.useTime)("absolute").getTime();
    const boot = (0, react_1.useRef)(true);
    const cursor = (0, react_1.useMemo)(() => {
        if (cache) {
            if ((timeout === 0 && boot.current) ||
                (timeout !== 0 && time > cache.rotated + timeout)) {
                const cursor = cache.cursor + 1;
                setCache(Object.assign(Object.assign({}, cache), { cursor, rotated: Date.now() }));
                boot.current = false;
                return cursor;
            }
            boot.current = false;
            return cache.cursor;
        }
        return 0;
    }, [cache, time, timeout]);
    // Fetch more when cursor reaches end
    (0, react_1.useEffect)(() => {
        if (cache && cursor >= cache.items.length - 1) {
            // fetch more
            fetch().then((items) => setCache(Object.assign(Object.assign({}, cache), { items: [...cache.items.slice(-10), ...items], cursor: 9 })));
        }
    }, [cursor]);
    // Refresh of deps change
    (0, react_1.useEffect)(() => {
        if (!cache || !areDepsEqual(deps, cache.deps)) {
            fetch().then((items) => setCache({ items, cursor: 0, rotated: Date.now(), deps }));
        }
    }, [...deps, cache]);
    return cache ? cache.items[cursor] : undefined;
}
exports.useRotatingCache = useRotatingCache;
/**
 * Implementation adapted from react's hook source.
 * Too bad they do not export it.
 */
function areDepsEqual(prevDeps, nextDeps) {
    for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
        if (Object.is(nextDeps[i], prevDeps[i])) {
            continue;
        }
        return false;
    }
    return true;
}
//# sourceMappingURL=useCache.js.map