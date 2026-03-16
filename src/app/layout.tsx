import type { Metadata } from "next";
import WalletProvider from "@/providers/WalletProvider";
import RealtimeProvider from "@/providers/RealtimeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CORTEX | AI Portfolio Strategist",
  description:
    "Autonomous AI-powered portfolio management protocol. Deposit, allocate, earn.",
  icons: {
    icon: [
      { url: "/cortex-logo.png", type: "image/png" },
    ],
    apple: "/cortex-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground font-body antialiased">
        <WalletProvider>
          <RealtimeProvider>{children}</RealtimeProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
