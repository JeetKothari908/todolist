"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const types_1 = require("../../plugins/backgrounds/gradient/types");
const types_2 = require("../../plugins/widgets/time/types");
const types_3 = require("../../plugins/widgets/todo/types");
function default_1(input) {
    // Data
    const data = {};
    // Backgrounds
    const backgrounds = [
        {
            id: (0, nanoid_1.nanoid)(),
            key: translateKey(input.dashboard.background) || "background/wallpapers",
            active: true,
            display: { blur: 0, luminosity: 0 },
        },
    ];
    data[backgrounds[0].id] = translateData(input.dashboard.background, input.storage[input.dashboard.background]);
    // Widgets
    const fontSettings = input.storage["core/widgets/font"];
    const fontDisplay = fontSettings
        ? {
            colour: fontSettings.settings.colour || "#ffffff",
            fontFamily: fontSettings.settings.family,
            fontSize: fontSettings.settings.size || 28,
        }
        : {};
    const widgets = input.dashboard.widgets
        .filter(translateKey)
        .map((previousType) => {
        const id = (0, nanoid_1.nanoid)();
        const key = translateKey(previousType); // false is removed in filter
        data[id] = translateData(previousType, input.storage[previousType]);
        return {
            id,
            key,
            active: true,
            display: Object.assign(Object.assign({}, fontDisplay), { position: "middleCentre" }),
        };
    });
    return {
        backgrounds,
        data,
        widgets,
        locale: input.settings.locale,
        timeZone: input.settings.timezone,
    };
}
exports.default = default_1;
// Translate plugin type keys
const keyMap = {
    "core/backgrounds/colour": "background/colour",
    "extra/backgrounds/dribbble": null,
    "extra/backgrounds/giphy": "background/wallpapers",
    "core/backgrounds/gradient": "background/gradient",
    "core/backgrounds/image": "background/image",
    "extra/backgrounds/unsplash": "background/wallpapers",
    "core/widgets/css": "widget/css",
    "core/widgets/font": null,
    "core/widgets/greeting": "widget/greeting",
    "widgets/js": "widget/js",
    "core/widgets/links": "widget/links",
    "widgets/literature-clock": null,
    "core/widgets/message": "widget/message",
    "extra/widgets/quote": null,
    "core/widgets/reload": null,
    "extra/widgets/search": null,
    "core/widgets/time": "widget/time",
    "widgets/todo": "widget/todo",
    "extra/widgets/weather": null,
};
function translateKey(key) {
    return keyMap[key];
}
function translateData(type, storage) {
    switch (type) {
        case "core/backgrounds/gradient":
            return storage
                ? Object.assign(Object.assign({}, types_1.defaultData), storage.settings) : undefined;
        case "core/backgrounds/image":
            // @todo Can I move this to cache?
            return undefined;
        case "core/widgets/links":
            return storage ? Object.assign({ columns: 1 }, storage.settings) : undefined;
        case "core/widgets/message":
            return storage && storage.settings
                ? { messages: [storage.settings.message] }
                : undefined;
        case "core/widgets/time":
            return storage ? Object.assign(Object.assign({}, types_2.defaultData), storage.settings) : undefined;
        case "widgets/todo":
            return storage
                ? Object.assign(Object.assign(Object.assign({}, types_3.defaultData), storage.settings), storage.local) : undefined;
        case "extra/widgets/weather":
            return storage
                ? {
                    showDetails: storage.local.details || false, // Move into data
                    latitude: storage.settings.latitude,
                    longitude: storage.settings.longitude,
                    units: storage.settings.units || "auto",
                }
                : undefined;
        default:
            return storage ? storage.settings : undefined;
    }
}
//# sourceMappingURL=migrate1.js.map