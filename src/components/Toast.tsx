"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  type?: "success" | "error" | "info";
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];

/** Call from anywhere to show a toast */
export function showToast(text: string, type: ToastMessage["type"] = "success") {
  const toast: ToastMessage = { id: crypto.randomUUID(), text, type };
  toastListeners.forEach((fn) => fn(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== handler);
    };
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 rounded-xl border border-border bg-card-solid px-4 py-3 shadow-lg animate-[slideUp_0.25s_ease-out]"
        >
          {toast.type === "success" && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20">
              <Check size={12} className="text-primary" />
            </div>
          )}
          {toast.type === "error" && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20">
              <X size={12} className="text-red-400" />
            </div>
          )}
          <span className="text-sm text-foreground">{toast.text}</span>
          <button
            onClick={() => dismiss(toast.id)}
            className="cursor-pointer ml-2 text-muted hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
