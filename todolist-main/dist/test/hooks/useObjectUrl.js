"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useObjectUrls = exports.useObjectUrl = void 0;
const react_1 = require("react");
function useObjectUrl(data) {
    // Separating these allows clean up + eagerly calculating the first one
    const url = (0, react_1.useMemo)(() => (data ? URL.createObjectURL(data) : null), [data]);
    (0, react_1.useEffect)(() => {
        const prev = url;
        () => {
            if (prev)
                URL.revokeObjectURL(prev);
        };
    }, [url]);
    return url;
}
exports.useObjectUrl = useObjectUrl;
function useObjectUrls(data) {
    const [urls, setUrls] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        setUrls(data.map(URL.createObjectURL));
        return () => {
            urls.map(URL.revokeObjectURL);
            setUrls([]);
        };
    }, [data]);
    return urls;
}
exports.useObjectUrls = useObjectUrls;
//# sourceMappingURL=useObjectUrl.js.map