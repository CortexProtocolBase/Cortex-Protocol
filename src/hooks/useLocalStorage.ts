"use client";
import { useState, useEffect } from "react";
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(initialValue);
  useEffect(() => { try { const item = window.localStorage.getItem(key); if (item) setStored(JSON.parse(item)); } catch {} }, [key]);
  const setValue = (value: T | ((prev: T) => T)) => {
    const newValue = value instanceof Function ? value(stored) : value;
    setStored(newValue);
    try { window.localStorage.setItem(key, JSON.stringify(newValue)); } catch {}
  };
  return [stored, setValue];
}
