// src/hooks/useAutosave.js
import { useEffect, useRef } from "react";

/**
 * useAutosave(key, value, { debounceMs })
 * Stores JSON value to localStorage debounced.
 */
export default function useAutosave(key, value, { debounceMs = 1000 } = {}) {
  const t = useRef(null);

  useEffect(() => {
    if (!key) return;
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.warn("Autosave failed", err);
      }
    }, debounceMs);

    return () => {
      if (t.current) clearTimeout(t.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(value)]);
}
