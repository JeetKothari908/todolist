"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("./actions");
const reducer_1 = require("./reducer");
describe("links/reducer()", () => {
    it("should add new links", () => {
        expect((0, reducer_1.reducer)([], (0, actions_1.addLink)())).toEqual([{ url: "https://" }]);
        expect((0, reducer_1.reducer)([{ url: "https://tabliss.io/" }], { type: "ADD_LINK" })).toEqual([{ url: "https://tabliss.io/" }, { url: "https://" }]);
    });
    it("should remove links", () => {
        expect((0, reducer_1.reducer)([
            { url: "https://tabliss.io/" },
            { url: "https://tabliss.io/about.html" },
        ], (0, actions_1.removeLink)(0))).toEqual([{ url: "https://tabliss.io/about.html" }]);
    });
    it("should update links", () => {
        expect((0, reducer_1.reducer)([
            { url: "https://tabliss.io/" },
            { url: "https://tabliss.io/about.html" },
        ], (0, actions_1.updateLink)(0, { name: "Tabliss", url: "https://tabliss.io/" }))).toEqual([
            { name: "Tabliss", url: "https://tabliss.io/" },
            { url: "https://tabliss.io/about.html" },
        ]);
    });
    it("should reorder links", () => {
        expect((0, reducer_1.reducer)([
            { url: "https://tabliss.io/" },
            { url: "https://tabliss.io/about.html" },
            { url: "https://tabliss.io/support.html" },
        ], (0, actions_1.reorderLink)(1, 0))).toEqual([
            { url: "https://tabliss.io/about.html" },
            { url: "https://tabliss.io/" },
            { url: "https://tabliss.io/support.html" },
        ]);
        expect((0, reducer_1.reducer)([
            { url: "https://tabliss.io/" },
            { url: "https://tabliss.io/about.html" },
            { url: "https://tabliss.io/support.html" },
        ], (0, actions_1.reorderLink)(1, 2))).toEqual([
            { url: "https://tabliss.io/" },
            { url: "https://tabliss.io/support.html" },
            { url: "https://tabliss.io/about.html" },
        ]);
    });
    it("should throw on unknown action", () => {
        expect(() => (0, reducer_1.reducer)([], { type: "UNKNOWN" })).toThrow();
    });
});
//# sourceMappingURL=reducer.test.js.map