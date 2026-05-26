"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const shared_1 = require("../../../views/shared");
require("./ImageSettings.sass");
const types_1 = require("./types");
const ImageSettings = ({ cache = types_1.defaultCache, setCache }) => {
    const urls = (0, hooks_1.useObjectUrls)(cache);
    const addImages = (files) => setCache(cache.concat(Array.from(files)));
    const removeImage = (index) => setCache(cache.filter((_, i) => index !== i));
    const largeImages = cache.some((image) => image.size > 2097152);
    return (react_1.default.createElement("div", { className: "ImageSettings" },
        react_1.default.createElement("label", null,
            react_1.default.createElement("input", { accept: "image/*", multiple: true, onChange: (event) => event.target.files && addImages(event.target.files), type: "file" })),
        react_1.default.createElement("div", { className: "grid" }, urls &&
            urls.map((url, index) => (react_1.default.createElement("div", { className: "preview", key: index },
                react_1.default.createElement("img", { src: url }),
                react_1.default.createElement(shared_1.IconButton, { onClick: () => removeImage(index), title: "Remove image" },
                    react_1.default.createElement(shared_1.RemoveIcon, null)))))),
        largeImages && (react_1.default.createElement("p", { className: "info" }, "Large images may affect performance.")),
        react_1.default.createElement("p", { className: "info" }, "Images do not sync between devices.")));
};
exports.default = ImageSettings;
//# sourceMappingURL=ImageSettings.js.map