"use client";

import { useSyncExternalStore } from "react";

// Tiny shared store so footer nav links (outside the canvas) can light up a docking bay inside it.
let current: string | null = null;
const listeners = new Set<() => void>();

export function setHoveredBay(id: string | null) {
  if (current === id) return;
  current = id;
  listeners.forEach((listener) => listener());
}

export function useHoveredBay() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => null,
  );
}
