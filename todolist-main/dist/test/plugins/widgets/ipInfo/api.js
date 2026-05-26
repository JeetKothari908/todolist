"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIpInfo = void 0;
async function getIpInfo(loader) {
    loader.push();
    const data = await fetch("https://ipwho.is/")
        .then((res) => res.json())
        .finally(() => loader.pop());
    return {
        ip: data.ip,
        city: data.city,
        country: data.country,
    };
}
exports.getIpInfo = getIpInfo;
//# sourceMappingURL=api.js.map