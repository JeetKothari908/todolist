"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFullscreen = void 0;
const react_1 = require("react");
const api_1 = require("../api");
function areWeFullscreen() {
    return Boolean(document.fullscreenElement);
}
function useFullscreen() {
    const pushError = (0, api_1.usePushError)();
    const [isFullscreen, setIsFullscreen] = (0, react_1.useState)(areWeFullscreen());
    const toggleFullscreen = document.fullscreenEnabled
        ? () => document.fullscreenElement
            ? document.exitFullscreen()
            : document.documentElement.requestFullscreen().catch(pushError)
        : false;
    (0, react_1.useEffect)(() => {
        const onChange = () => setIsFullscreen(areWeFullscreen());
        document.onfullscreenchange = onChange;
        return () => {
            document.onfullscreenchange = null;
        };
    }, []);
    return [isFullscreen, toggleFullscreen];
}
exports.useFullscreen = useFullscreen;
//# sourceMappingURL=useFullscreen.js.map