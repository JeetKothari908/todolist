"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const state_1 = require("../../db/state");
const react_2 = require("../../lib/db/react");
const TimeZoneInput_1 = __importDefault(require("../shared/timeZone/TimeZoneInput"));
const System = () => {
    const [locale, setLocale] = (0, react_2.useKey)(state_1.db, "locale");
    const [timeZone, setTimeZone] = (0, react_2.useKey)(state_1.db, "timeZone");
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null,
            react_1.default.createElement(react_intl_1.FormattedMessage, { id: "settings", defaultMessage: "Settings", description: "Settings title" })),
        react_1.default.createElement("label", { style: {
                alignItems: "center",
                display: "grid",
                gridGap: "0 0.5rem",
                gridTemplateColumns: "1fr 2fr",
                width: "100%",
                margin: 0,
            } },
            react_1.default.createElement("span", null, "Language"),
            react_1.default.createElement("select", { value: locale, onChange: (event) => setLocale(event.target.value) },
                react_1.default.createElement("option", { value: "ar", title: "Arabic" }, "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"),
                react_1.default.createElement("option", { value: "ca-ES", title: "Catalan" }, "Catal\u00E0"),
                react_1.default.createElement("option", { value: "cs", title: "Czech" }, "\u010Ce\u0161tina"),
                react_1.default.createElement("option", { value: "de", title: "German" }, "Deutsch"),
                react_1.default.createElement("option", { value: "el", title: "Greek" }, "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC"),
                react_1.default.createElement("option", { value: "en-AU", title: "English (Australian)" }, "English (AU)"),
                react_1.default.createElement("option", { value: "en-CA", title: "English (Canadian)" }, "English (CA)"),
                react_1.default.createElement("option", { value: "en-GB", title: "English (British)" }, "English (GB)"),
                react_1.default.createElement("option", { value: "en", title: "English (American)" }, "English (US)"),
                react_1.default.createElement("option", { value: "es", title: "Spanish" }, "Espa\u00F1ol"),
                react_1.default.createElement("option", { value: "fa", title: "Persian" }, "\u067E\u0627\u0631\u0633\u06CC"),
                react_1.default.createElement("option", { value: "fr", title: "French" }, "Fran\u00E7ais"),
                react_1.default.createElement("option", { value: "he", title: "Hebrew" }, "\u05E2\u05D1\u05E8\u05D9\u05EA"),
                react_1.default.createElement("option", { value: "ga", title: "Gaeilge" }, "Gaeilge"),
                react_1.default.createElement("option", { value: "gd", title: "Scottish Gaelic" }, "G\u00E0idhlig"),
                react_1.default.createElement("option", { value: "gl", title: "Galician" }, "Galego"),
                react_1.default.createElement("option", { value: "gu", title: "Gujarati" }, "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0"),
                react_1.default.createElement("option", { value: "hi", title: "Hindi" }, "\u0939\u093F\u0928\u094D\u0926\u0940"),
                react_1.default.createElement("option", { value: "hu", title: "Hungarian" }, "Magyar"),
                react_1.default.createElement("option", { value: "id", title: "Indonesian" }, "Indonesian"),
                react_1.default.createElement("option", { value: "it", title: "Italian" }, "Italiano"),
                react_1.default.createElement("option", { value: "ja", title: "Japanese" }, "\u65E5\u672C\u8A9E"),
                react_1.default.createElement("option", { value: "ko", title: "Korean" }, "\uD55C\uAD6D\uC5B4"),
                react_1.default.createElement("option", { value: "kp", title: "North Korean" }, "\uC870\uC120\uB9D0"),
                react_1.default.createElement("option", { value: "lb", title: "Luxembourgish" }, "L\u00EBtzebuergesch"),
                react_1.default.createElement("option", { value: "lt", title: "Lithuanian" }, "Lietuvi\u0173 k."),
                react_1.default.createElement("option", { value: "ne", title: "Nepali" }, "Nepali"),
                react_1.default.createElement("option", { value: "nl", title: "Dutch" }, "Nederlands"),
                react_1.default.createElement("option", { value: "no", title: "Norwegian" }, "Norsk"),
                react_1.default.createElement("option", { value: "pl", title: "Polish" }, "Polski"),
                react_1.default.createElement("option", { value: "pt-BR", title: "Portuguese (Brazil)" }, "Portugu\u00EAs do Brasil"),
                react_1.default.createElement("option", { value: "pt", title: "Portuguese (Portugal)" }, "Portugu\u00EAs de Portugal"),
                react_1.default.createElement("option", { value: "ro", title: "Romanian" }, "Rom\u00E2n\u0103"),
                react_1.default.createElement("option", { value: "ru", title: "Russian" }, "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"),
                react_1.default.createElement("option", { value: "sk", title: "Slovak" }, "Sloven\u010Dina"),
                react_1.default.createElement("option", { value: "sr", title: "Serbian" }, "\u0421\u0440\u043F\u0441\u043A\u0438"),
                react_1.default.createElement("option", { value: "fi", title: "Finnish" }, "Suomi"),
                react_1.default.createElement("option", { value: "sv", title: "Swedish" }, "Svenska"),
                react_1.default.createElement("option", { value: "ta", title: "Tamil" }, "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD"),
                react_1.default.createElement("option", { value: "th", title: "Thai" }, "\u0E44\u0E17\u0E22"),
                react_1.default.createElement("option", { value: "tr", title: "Turkish" }, "T\u00FCrk\u00E7e"),
                react_1.default.createElement("option", { value: "vi", title: "Vietnamese" }, "Ti\u1EBFng Vi\u1EC7t"),
                react_1.default.createElement("option", { value: "zh-CN", title: "Simplified Chinese (China)" }, "\u4E2D\u6587\uFF08\u4E2D\u56FD\uFF09"),
                react_1.default.createElement("option", { value: "zh-TW", title: "Traditional Chinese (Taiwan)" }, "\u4E2D\u6587\uFF08\u53F0\u7063\uFF09"),
                react_1.default.createElement("option", { value: "uk", title: "Ukrainian" }, "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430"))),
        react_1.default.createElement("label", { style: {
                alignItems: "center",
                display: "grid",
                gridGap: "0 0.5rem",
                gridTemplateColumns: "1fr 2fr",
                width: "100%",
                margin: 0,
            } },
            "Time Zone",
            react_1.default.createElement(TimeZoneInput_1.default, { timeZone: timeZone, onChange: setTimeZone }))));
};
exports.default = System;
//# sourceMappingURL=System.js.map