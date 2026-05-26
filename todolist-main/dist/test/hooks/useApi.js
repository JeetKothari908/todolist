"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApi = void 0;
const react_1 = require("react");
const ui_1 = require("../contexts/ui");
const state_1 = require("../db/state");
const react_2 = require("../lib/db/react");
// TODO: consider alternative ways to supply api that isn't eager loading
//       the entire object for every plugin
function useApi(id) {
    // Cache
    const [cache, setCache] = (0, react_2.useKey)(state_1.cache, id);
    // Data
    const [data, setData] = (0, react_2.useKey)(state_1.db, `data/${id}`);
    // Loader
    const { pushLoader, popLoader } = (0, react_1.useContext)(ui_1.UiContext);
    const loader = { push: pushLoader, pop: popLoader };
    return {
        cache,
        data,
        loader,
        setCache,
        setData,
    };
}
exports.useApi = useApi;
//# sourceMappingURL=useApi.js.map