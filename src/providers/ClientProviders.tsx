"use client";

import type { ReactNode } from "react";
import WalletProvider from "@/providers/WalletProvider";
import RealtimeProvider from "@/providers/RealtimeProvider";
import { CortexWalletProvider } from "@/contexts/WalletContext";
import WalletModal from "@/components/WalletModal";
import ToastContainer from "@/components/Toast";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <CortexWalletProvider>
        <RealtimeProvider>{children}</RealtimeProvider>
        <WalletModal />
        <ToastContainer />
      </CortexWalletProvider>
    </WalletProvider>
  );
}
