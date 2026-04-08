import type { Metadata } from "next";
import ClientProviders from "@/providers/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "CORTEX | AI Portfolio Strategist",
  description:
    "Autonomous AI-powered portfolio management protocol. Deposit, allocate, earn.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
