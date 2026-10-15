"use client";

type TwitterWidgets = {
  widgets: {
    load: (element?: Element | null) => void;
  };
};

declare global {
  interface Window {
    twttr?: TwitterWidgets;
  }
}

let widgetsLoadingPromise: Promise<void> | null = null;

export function loadTwitterWidgetsOnce(): Promise<void> {
  if (window.twttr?.widgets) return Promise.resolve();
  if (widgetsLoadingPromise) return widgetsLoadingPromise;

  const script = document.createElement("script");
  script.src = "https://platform.twitter.com/widgets.js";
  script.async = true;

  widgetsLoadingPromise = new Promise<void>((resolve, reject) => {
    script.onload = () => {
      if (window.twttr?.widgets) {
        resolve();
      } else {
        script.remove();
        reject(new Error("X widgets script loaded without exposing its API"));
      }
    };
    script.onerror = () => {
      script.remove();
      reject(new Error("Failed to load X widgets script"));
    };
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    widgetsLoadingPromise = null;
    throw error;
  });

  return widgetsLoadingPromise;
}
