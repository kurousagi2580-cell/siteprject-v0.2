"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function usePagination(defaultPage = 1) {
  const router = useRouter();
  const params = useSearchParams();
  const page = Number(params?.get("page") ?? defaultPage);

  function goTo(p: number) {
    const q = new URLSearchParams(Array.from(params.entries()));
    q.set("page", String(p));
    const newUrl = `/search?${q.toString()}`;

    try {
      const current = window.location.pathname + window.location.search;
      if (current === newUrl) return;
    } catch (e) {}

    router.push(newUrl);
  }

  return { page, goTo };
}
