import type { Metadata } from "next";
export const siteMetadata: Metadata = {
  title: { default: "CORTEX Protocol — AI-Managed DeFi Vault on Base", template: "%s | CORTEX Protocol" },
  description: "Deposit ETH or USDC into the CORTEX Vault on Base. An autonomous AI agent manages a diversified DeFi portfolio and distributes yield back to depositors.",
  keywords: ["DeFi", "AI", "Base", "vault", "yield", "autonomous", "portfolio", "ERC-4626", "cryptocurrency"],
  authors: [{ name: "CORTEX Protocol" }],
  creator: "CORTEX Protocol",
  openGraph: { type: "website", locale: "en_US", url: "https://www.cortexprotocol.net", siteName: "CORTEX Protocol", title: "CORTEX Protocol — AI-Managed DeFi Vault", description: "Autonomous AI manages your DeFi portfolio on Base. Deposit and earn yield.", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CORTEX Protocol" }] },
  twitter: { card: "summary_large_image", title: "CORTEX Protocol", description: "AI-managed DeFi vault on Base", images: ["/og-image.png"], creator: "@CortexBase" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};
