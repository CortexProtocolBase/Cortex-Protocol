"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient, type RealtimeChannel } from "@supabase/supabase-js";

// ─── Types ───────────────────────────────────────────────────────────

interface RealtimeState {
  vaultTvl: number | null;
  lastTradeId: string | null;
  lastAiCycleId: number | null;
  connected: boolean;
}

interface RealtimeContextValue extends RealtimeState {
  subscribe: (table: string, callback: (payload: unknown) => void) => () => void;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  vaultTvl: null,
  lastTradeId: null,
  lastAiCycleId: null,
  connected: false,
  subscribe: () => () => {},
});

export function useRealtime() {
  return useContext(RealtimeContext);
}

// ─── Provider ────────────────────────────────────────────────────────

export default function RealtimeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RealtimeState>({
    vaultTvl: null,
    lastTradeId: null,
    lastAiCycleId: null,
    connected: false,
  });

  const [supabase] = useState(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
  });

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("cortex-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "vault_snapshots" },
        (payload) => {
          const record = payload.new as { tvl?: number };
          if (record.tvl) {
            setState((prev) => ({ ...prev, vaultTvl: record.tvl! }));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "trades" },
        (payload) => {
          const record = payload.new as { id?: string };
          if (record.id) {
            setState((prev) => ({ ...prev, lastTradeId: record.id! }));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ai_reasoning_logs" },
        (payload) => {
          const record = payload.new as { cycle_id?: number };
          if (record.cycle_id) {
            setState((prev) => ({ ...prev, lastAiCycleId: record.cycle_id! }));
          }
        }
      )
      .subscribe((status) => {
        setState((prev) => ({ ...prev, connected: status === "SUBSCRIBED" }));
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const subscribe = useCallback(
    (table: string, callback: (payload: unknown) => void) => {
      if (!supabase) return () => {};
      let channel: RealtimeChannel | null = supabase
        .channel(`custom-${table}-${Date.now()}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => callback(payload)
        )
        .subscribe();

      return () => {
        if (channel) {
          supabase.removeChannel(channel);
          channel = null;
        }
      };
    },
    [supabase]
  );

  return (
    <RealtimeContext.Provider value={{ ...state, subscribe }}>
      {children}
    </RealtimeContext.Provider>
  );
}
