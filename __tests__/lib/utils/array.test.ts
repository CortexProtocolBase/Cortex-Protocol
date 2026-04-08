import { chunk, unique, groupBy, sortBy } from "@/lib/utils/array";

describe("chunk", () => {
  it("chunks evenly", () => { expect(chunk([1,2,3,4], 2)).toEqual([[1,2],[3,4]]); });
  it("handles remainder", () => { expect(chunk([1,2,3], 2)).toEqual([[1,2],[3]]); });
  it("handles empty", () => { expect(chunk([], 2)).toEqual([]); });
});

describe("unique", () => {
  it("removes duplicates", () => { expect(unique([1,2,2,3,3,3])).toEqual([1,2,3]); });
  it("handles empty", () => { expect(unique([])).toEqual([]); });
  it("handles strings", () => { expect(unique(["a","b","a"])).toEqual(["a","b"]); });
});

describe("groupBy", () => {
  it("groups by key", () => {
    const items = [{ tier: "core", name: "a" }, { tier: "core", name: "b" }, { tier: "mid", name: "c" }];
    const result = groupBy(items, "tier");
    expect(Object.keys(result)).toEqual(["core", "mid"]);
    expect(result["core"]).toHaveLength(2);
    expect(result["mid"]).toHaveLength(1);
  });
});

describe("sortBy", () => {
  it("sorts ascending", () => {
    const items = [{ val: 3 }, { val: 1 }, { val: 2 }];
    expect(sortBy(items, "val").map(i => i.val)).toEqual([1, 2, 3]);
  });
  it("sorts descending", () => {
    const items = [{ val: 1 }, { val: 3 }, { val: 2 }];
    expect(sortBy(items, "val", true).map(i => i.val)).toEqual([3, 2, 1]);
  });
});
