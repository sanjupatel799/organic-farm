"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` once the component has mounted on the client.
 * Prevents hydration mismatches caused by browser-only state (localStorage, etc.)
 * by ensuring the first client render matches the server-rendered HTML.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
