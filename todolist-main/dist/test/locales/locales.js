"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLocale = exports.locales = exports.messages = void 0;
const in_browser_language_1 = require("in-browser-language");
const ar_json_1 = __importDefault(require("./lang/ar.json"));
const ca_ES_json_1 = __importDefault(require("./lang/ca-ES.json"));
const cs_json_1 = __importDefault(require("./lang/cs.json"));
const de_json_1 = __importDefault(require("./lang/de.json"));
const el_json_1 = __importDefault(require("./lang/el.json"));
const en_AU_json_1 = __importDefault(require("./lang/en-AU.json"));
const en_CA_json_1 = __importDefault(require("./lang/en-CA.json"));
const en_GB_json_1 = __importDefault(require("./lang/en-GB.json"));
const es_json_1 = __importDefault(require("./lang/es.json"));
const fa_json_1 = __importDefault(require("./lang/fa.json"));
const fi_json_1 = __importDefault(require("./lang/fi.json"));
const fr_json_1 = __importDefault(require("./lang/fr.json"));
const ga_json_1 = __importDefault(require("./lang/ga.json"));
const gd_json_1 = __importDefault(require("./lang/gd.json"));
const gl_json_1 = __importDefault(require("./lang/gl.json"));
const gu_json_1 = __importDefault(require("./lang/gu.json"));
const hi_json_1 = __importDefault(require("./lang/hi.json"));
const hu_json_1 = __importDefault(require("./lang/hu.json"));
const id_json_1 = __importDefault(require("./lang/id.json"));
const it_json_1 = __importDefault(require("./lang/it.json"));
const ja_json_1 = __importDefault(require("./lang/ja.json"));
const ko_json_1 = __importDefault(require("./lang/ko.json"));
const kp_json_1 = __importDefault(require("./lang/kp.json"));
const lt_json_1 = __importDefault(require("./lang/lt.json"));
const lb_json_1 = __importDefault(require("./lang/lb.json"));
const ne_json_1 = __importDefault(require("./lang/ne.json"));
const nl_json_1 = __importDefault(require("./lang/nl.json"));
const no_json_1 = __importDefault(require("./lang/no.json"));
const ro_json_1 = __importDefault(require("./lang/ro.json"));
const ru_json_1 = __importDefault(require("./lang/ru.json"));
const sk_json_1 = __importDefault(require("./lang/sk.json"));
const sr_json_1 = __importDefault(require("./lang/sr.json"));
const sv_json_1 = __importDefault(require("./lang/sv.json"));
const pl_json_1 = __importDefault(require("./lang/pl.json"));
const pt_json_1 = __importDefault(require("./lang/pt.json"));
const pt_BR_json_1 = __importDefault(require("./lang/pt-BR.json"));
const ta_json_1 = __importDefault(require("./lang/ta.json"));
const th_json_1 = __importDefault(require("./lang/th.json"));
const tr_json_1 = __importDefault(require("./lang/tr.json"));
const vi_json_1 = __importDefault(require("./lang/vi.json"));
const zh_CN_json_1 = __importDefault(require("./lang/zh-CN.json"));
const zh_TW_json_1 = __importDefault(require("./lang/zh-TW.json"));
const uk_json_1 = __importDefault(require("./lang/uk.json"));
exports.messages = {
    ar: ar_json_1.default,
    "ca-ES": ca_ES_json_1.default,
    cs: cs_json_1.default,
    de: de_json_1.default,
    el: el_json_1.default,
    en: {},
    "en-AU": en_AU_json_1.default,
    "en-CA": en_CA_json_1.default,
    "en-GB": en_GB_json_1.default,
    es: es_json_1.default,
    fa: fa_json_1.default,
    fi: fi_json_1.default,
    fr: fr_json_1.default,
    ga: ga_json_1.default,
    gd: gd_json_1.default,
    gl: gl_json_1.default,
    gu: gu_json_1.default,
    hi: hi_json_1.default,
    hu: hu_json_1.default,
    id: id_json_1.default,
    it: it_json_1.default,
    ja: ja_json_1.default,
    ko: ko_json_1.default,
    kp: kp_json_1.default,
    lt: lt_json_1.default,
    lb: lb_json_1.default,
    ne: ne_json_1.default,
    nl: nl_json_1.default,
    no: no_json_1.default,
    ro: ro_json_1.default,
    ru: ru_json_1.default,
    sk: sk_json_1.default,
    sr: sr_json_1.default,
    sv: sv_json_1.default,
    pl: pl_json_1.default,
    pt: pt_json_1.default,
    "pt-BR": pt_BR_json_1.default,
    ta: ta_json_1.default,
    th: th_json_1.default,
    tr: tr_json_1.default,
    vi: vi_json_1.default,
    zh: {},
    "zh-CN": zh_CN_json_1.default,
    "zh-TW": zh_TW_json_1.default,
    uk: uk_json_1.default,
};
exports.locales = Object.keys(exports.messages);
exports.defaultLocale = (0, in_browser_language_1.pick)(exports.locales, "en");
//# sourceMappingURL=locales.js.map