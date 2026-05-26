"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const serviceWorker_1 = require("./serviceWorker");
const Root_1 = __importDefault(require("./views/Root"));
// Render app into root element
(0, client_1.createRoot)(document.getElementById("root")).render(react_1.default.createElement(Root_1.default, null));
// Register service worker on web
if (!DEV && BUILD_TARGET === "web") {
    (0, serviceWorker_1.register)();
}
//# sourceMappingURL=main.js.map