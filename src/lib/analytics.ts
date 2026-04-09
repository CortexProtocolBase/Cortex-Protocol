export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try { if ((window as any).gtag) { (window as any).gtag("event", event, properties); } } catch {}
}
export function trackPageView(path: string) { trackEvent("page_view", { page_path: path }); }
export function trackWalletConnect(address: string) { trackEvent("wallet_connect", { address: address.slice(0, 10) }); }
export function trackDeposit(amount: number, token: string) { trackEvent("deposit", { amount, token }); }
export function trackWithdraw(amount: number) { trackEvent("withdraw", { amount }); }
