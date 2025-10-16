'use client';

// src/components/ActivityReporter.tsx
import { useEffect, useRef } from "react";
import { apiFetch } from "../lib/api";

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function ActivityReporter() {
  const hadActivity = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // mark that the user did something
    const mark = () => {
      hadActivity.current = true;
    };

    // listen for real user input
    window.addEventListener("mousemove", mark, { passive: true });
    window.addEventListener("keydown", mark);
    window.addEventListener("click", mark, { passive: true });
    window.addEventListener("touchstart", mark, { passive: true });

    // periodically send a ping if there was activity
    const tick = async () => {
      if (document.visibilityState !== "visible") return;
      if (!hadActivity.current) return;
      hadActivity.current = false;
      try {
        await apiFetch("/api/activity/", { method: "POST" });
      } catch {
        // ignore failures
      }
    };

    timer.current = window.setInterval(tick, INTERVAL_MS);

    return () => {
      window.removeEventListener("mousemove", mark);
      window.removeEventListener("keydown", mark);
      window.removeEventListener("click", mark);
      window.removeEventListener("touchstart", mark);
      if (timer.current) {
        window.clearInterval(timer.current);
      }
    };
  }, []);

  return null;
}
