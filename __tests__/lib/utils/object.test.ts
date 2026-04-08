import { pick, omit, deepEqual } from "@/lib/utils/object";

describe("pick", () => {
  it("picks specified keys", () => { expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 }); });
  it("ignores missing keys", () => { expect(pick({ a: 1 }, ["a", "b" as any])).toEqual({ a: 1 }); });
});

describe("omit", () => {
  it("omits specified keys", () => { expect(omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 }); });
});

describe("deepEqual", () => {
  it("compares primitives", () => { expect(deepEqual(1, 1)).toBe(true); expect(deepEqual(1, 2)).toBe(false); });
  it("compares objects", () => { expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true); expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false); });
  it("compares nested", () => { expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true); });
  it("compares arrays", () => { expect(deepEqual([1, 2], [1, 2])).toBe(true); expect(deepEqual([1], [1, 2])).toBe(false); });
});
