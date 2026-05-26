"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB = __importStar(require("./db"));
test("database init", () => {
    DB.init();
});
test("database put", () => {
    const db = DB.init();
    DB.put(db, "test", "test");
});
test("database get", () => {
    const db = DB.init();
    DB.put(db, "test", "test");
    expect(DB.get(db, "test")).toBe("test");
});
test("database prefix", () => {
    const db = DB.init();
    DB.put(db, "prefix/a", "a");
    DB.put(db, "prefix/b", "b");
    DB.put(db, "ignore", "c");
    const result = Array.from(DB.prefix(db, "prefix/"));
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(["prefix/a", "a"]);
    expect(result).toContainEqual(["prefix/b", "b"]);
    expect(result).not.toContainEqual(["ignore", "c"]);
});
test("database del", () => {
    const db = DB.init();
    DB.put(db, "test", "test");
    DB.del(db, "test");
    expect(DB.get(db, "test")).toBeUndefined();
});
test("database listen", () => {
    const db = DB.init();
    const fn = jest.fn();
    DB.listen(db, fn);
    DB.put(db, "test", "test");
    expect(fn).toBeCalledWith(["test", "test"]);
});
test("database listen unsubscribe", () => {
    const db = DB.init();
    const fn = jest.fn();
    const unsub = DB.listen(db, fn);
    unsub();
    DB.put(db, "test", "test");
    expect(fn).not.toBeCalled();
});
test("database default data", () => {
    const db = DB.init({ test: "test" });
    expect(DB.get(db, "test")).toBe("test");
});
test("database atomic writes flush", () => {
    const db = DB.init();
    DB.atomic(db, (trx) => {
        DB.put(trx, "test", "test");
    });
    expect(DB.get(db, "test")).toBe("test");
});
test("database atomic writes do not flush on error", () => {
    const db = DB.init();
    expect(() => DB.atomic(db, (trx) => {
        DB.put(trx, "test", "test");
        throw null;
    })).toThrow();
    expect(DB.get(db, "test")).toBeUndefined();
});
test("database atomic flushes deletes", () => {
    const db = DB.init();
    DB.put(db, "test", "test");
    DB.atomic(db, (trx) => {
        DB.del(trx, "test");
    });
    expect(DB.get(db, "test")).toBeUndefined();
});
test("database atom prefix search", () => {
    const db = DB.init();
    DB.put(db, "prefix/a", "a");
    DB.atomic(db, (trx) => {
        DB.put(trx, "prefix/b", "b");
        const result = Array.from(DB.prefix(trx, "prefix/"));
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(["prefix/a", "a"]);
        expect(result).toContainEqual(["prefix/b", "b"]);
    });
});
test("database atomic prefix search duplicate", () => {
    const db = DB.init();
    DB.put(db, "test", "test");
    DB.atomic(db, (trx) => {
        DB.put(trx, "test", "atomic");
        const result = Array.from(DB.prefix(trx, "t"));
        expect(result).toHaveLength(1);
        expect(result).toContainEqual(["test", "atomic"]);
    });
});
//# sourceMappingURL=db.test.js.map