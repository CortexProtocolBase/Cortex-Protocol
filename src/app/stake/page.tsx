"use client";

import Navbar from "@/components/Navbar";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function StakePage() {
  return (
    <>
      <Navbar />

      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        <div className="relative min-h-[60vh] flex items-center justify-center">
          {/* Blurred background content */}
          <div className="absolute inset-0 pointer-events-none select-none blur-[6px] opacity-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {["Total Staked", "Your Staked", "Pending Rewards", "Current APR"].map((label) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-6">
                  <p className="text-muted text-sm">{label}</p>
                  <p className="font-heading text-2xl font-bold mt-2">—</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
              <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 h-64" />
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 h-64" />
            </div>
          </div>

          {/* Coming Soon overlay */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-6">
              <Lock className="w-7 h-7 text-muted" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
              Staking Coming Soon
            </h1>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              Stake $CORTEX tokens to earn a share of protocol fees. Lock longer for higher multipliers. This feature is currently under development.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center bg-foreground text-background rounded-xl px-6 py-3 font-heading font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
