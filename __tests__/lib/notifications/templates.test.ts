import { renderTemplate, TEMPLATES } from "@/lib/notifications/templates";

describe("renderTemplate", () => {
  it("renders trade_executed", () => {
    const { title, body } = renderTemplate("trade_executed", { type: "Swap", asset: "ETH/USDC", amount: "12,400", protocol: "Uniswap" });
    expect(title).toBe("Trade Executed");
    expect(body).toContain("Swap");
    expect(body).toContain("ETH/USDC");
    expect(body).toContain("12,400");
    expect(body).toContain("Uniswap");
  });

  it("renders large_deposit", () => {
    const { title, body } = renderTemplate("large_deposit", { amount: "50,000", address: "0xAb3...7f2" });
    expect(title).toBe("Large Deposit");
    expect(body).toContain("50,000");
    expect(body).toContain("0xAb3...7f2");
  });

  it("renders risk_alert", () => {
    const { title, body } = renderTemplate("risk_alert", { message: "High volatility detected" });
    expect(title).toBe("Risk Alert");
    expect(body).toBe("High volatility detected");
  });

  it("renders rebalance", () => {
    const { body } = renderTemplate("rebalance", { confidence: "87" });
    expect(body).toContain("87");
  });
});

describe("TEMPLATES", () => {
  it("has all required categories", () => {
    const categories = ["trade_executed", "rebalance", "large_deposit", "large_withdrawal", "governance_proposal", "risk_alert", "system_health", "price_alert"];
    for (const cat of categories) {
      expect(TEMPLATES[cat as keyof typeof TEMPLATES]).toBeDefined();
    }
  });
  it("each template has title and body", () => {
    for (const t of Object.values(TEMPLATES)) {
      expect(t.title).toBeTruthy();
      expect(t.body).toBeTruthy();
      expect(t.priority).toBeTruthy();
    }
  });
});
