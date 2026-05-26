"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
describe("unsplash/api", () => {
    it("should calculate width for screen", () => {
        expect((0, api_1.calculateWidth)()).toBe(1920);
        expect((0, api_1.calculateWidth)(1920)).toBe(1920);
        expect((0, api_1.calculateWidth)(2000)).toBe(2160);
        expect((0, api_1.calculateWidth)(5000)).toBe(3840);
    });
    it("should consider pixel ratio", () => {
        expect((0, api_1.calculateWidth)(1000, 2)).toBe(2160);
    });
});
//# sourceMappingURL=api.test.js.map