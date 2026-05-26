"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundConfigs = void 0;
const colour_1 = __importDefault(require("./colour"));
const gradient_1 = __importDefault(require("./gradient"));
const image_1 = __importDefault(require("./image"));
const wallpapers_1 = __importDefault(require("./wallpapers"));
exports.backgroundConfigs = [colour_1.default, gradient_1.default, image_1.default, wallpapers_1.default];
exports.backgroundConfigs.sort((a, b) => a.name.localeCompare(b.name));
//# sourceMappingURL=index.js.map