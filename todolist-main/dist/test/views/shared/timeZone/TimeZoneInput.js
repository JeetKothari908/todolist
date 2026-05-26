"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_tz_1 = require("date-fns-tz");
const react_1 = __importDefault(require("react"));
const zones_json_1 = __importDefault(require("./zones.json"));
let cachedZoneOptions = null;
const TimeZoneInput = ({ timeZone, onChange }) => {
    const [zoneOptions, setZoneOptions] = react_1.default.useState(cachedZoneOptions);
    react_1.default.useEffect(() => {
        if (zoneOptions !== null)
            return;
        const date = new Date();
        cachedZoneOptions = zones_json_1.default
            .flatMap((zone) => {
            try {
                const offset = (0, date_fns_tz_1.getTimezoneOffset)(zone, date) / 3600000;
                const offsetFormatted = (offset >= 0 ? "+" : "-") + Math.abs(offset);
                return {
                    id: zone,
                    name: `(UTC${offsetFormatted}) ${zone.replaceAll("_", " ")}`,
                    offset,
                };
            }
            catch (_a) {
                // This time zone not supported in this browser
                return [];
            }
        })
            .sort((a, b) => {
            const delta = a.offset - b.offset;
            return delta === 0 ? a.name.localeCompare(b.name) : delta;
        });
        setZoneOptions(cachedZoneOptions);
    }, []);
    return (react_1.default.createElement("select", { value: timeZone || "", onChange: (event) => onChange(event.target.value || null) },
        react_1.default.createElement("option", { value: "" }, "Automatic"),
        zoneOptions ? (zoneOptions.map((option) => (react_1.default.createElement("option", { key: option.id, value: option.id }, option.name)))) : (react_1.default.createElement("option", { disabled: true }, "Loading..."))));
};
exports.default = TimeZoneInput;
//# sourceMappingURL=TimeZoneInput.js.map