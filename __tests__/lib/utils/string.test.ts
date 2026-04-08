import { capitalize, truncate, slugify, camelToKebab } from "@/lib/utils/string";

describe("capitalize", () => {
  it("capitalizes first letter", () => { expect(capitalize("hello")).toBe("Hello"); });
  it("handles empty", () => { expect(capitalize("")).toBe(""); });
  it("handles already capitalized", () => { expect(capitalize("Hello")).toBe("Hello"); });
});

describe("truncate", () => {
  it("truncates long string", () => { expect(truncate("hello world foo", 10)).toBe("hello w..."); });
  it("passes short string", () => { expect(truncate("hello", 10)).toBe("hello"); });
});

describe("slugify", () => {
  it("converts to slug", () => { expect(slugify("Hello World")).toBe("hello-world"); });
  it("removes special chars", () => { expect(slugify("a@b#c")).toBe("a-b-c"); });
  it("trims dashes", () => { expect(slugify("  hello  ")).toBe("hello"); });
});

describe("camelToKebab", () => {
  it("converts camelCase", () => { expect(camelToKebab("helloWorld")).toBe("hello-world"); });
  it("handles multiple words", () => { expect(camelToKebab("myLongVariableName")).toBe("my-long-variable-name"); });
});
