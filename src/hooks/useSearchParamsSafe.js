"use client";
import { useSearchParams as useSearchParamsNext } from "next/navigation";
import { useEffect, useState } from "react";

export function useSearchParamsSafe() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParamsNext();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return new URLSearchParams();
  }

  return searchParams;
}
