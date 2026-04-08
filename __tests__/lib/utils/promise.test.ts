import { sleep, timeout } from "@/lib/utils/promise";

describe("sleep", () => {
  it("resolves after delay", async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });
});

describe("timeout", () => {
  it("resolves fast promise", async () => {
    const result = await timeout(Promise.resolve("ok"), 1000);
    expect(result).toBe("ok");
  });
  it("rejects slow promise", async () => {
    await expect(timeout(sleep(500).then(() => "late"), 10)).rejects.toThrow("Timeout");
  });
});
