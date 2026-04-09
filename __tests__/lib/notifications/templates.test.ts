import { renderTemplate } from "@/lib/notifications/templates";
describe("Notification Templates", () => {
  test("renders trade_executed template", () => { const { title, body } = renderTemplate("trade_executed", { type: "Swap", asset: "ETH/USDC", amount: "12,400", protocol: "Uniswap" }); expect(title).toBe("Trade Executed"); expect(body).toContain("Swap"); expect(body).toContain("ETH/USDC"); });
  test("renders large_deposit template", () => { const { title, body } = renderTemplate("large_deposit", { amount: "50,000", address: "0xAb3...7f2" }); expect(body).toContain("50,000"); });
  test("renders risk_alert template", () => { const { title, body } = renderTemplate("risk_alert", { message: "High volatility detected" }); expect(title).toBe("Risk Alert"); expect(body).toContain("volatility"); });
});
