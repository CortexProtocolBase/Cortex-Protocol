import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CORTEX | AI Portfolio Strategist",
  description:
    "Autonomous AI-powered portfolio management protocol. Deposit, allocate, earn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground font-body antialiased">
        {children}
      </body>
    </html>
  );
}
