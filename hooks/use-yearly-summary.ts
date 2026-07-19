"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useDataRefresh } from "@/context/data-refresh-context";
import { useCategories } from "@/hooks/use-categories";
import { computeYearlySummary } from "@/lib/calculations/dashboard";
import type { YearlySummary } from "@/types/dashboard";

interface State {
  key: string;
  summary: YearlySummary | null;
}

const EMPTY_STATE: State = { key: "", summary: null };

export function useYearlySummary(year: number) {
  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  const { refreshKey } = useDataRefresh();
  const [state, setState] = useState<State>(EMPTY_STATE);

  const categoriesSignature = categories
    .map((c) => `${c.id}:${c.plannedBudget}:${c.updatedAt}`)
    .join(",");
  const key = JSON.stringify({
    uid: user?.uid ?? null,
    year,
    refreshKey,
    categoriesSignature,
  });

  useEffect(() => {
    if (!user || categoriesLoading) return;
    let cancelled = false;
    computeYearlySummary(user.uid, year, categories).then((summary) => {
      if (!cancelled) setState({ key, summary });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, user, categoriesLoading]);

  const loading = Boolean(user) && (categoriesLoading || state.key !== key);
  const summary = state.key === key ? state.summary : null;

  return { summary, loading };
}
