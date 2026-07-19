"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useDataRefresh } from "@/context/data-refresh-context";
import {
  fetchAllTransactionsForFilters,
  type TransactionQueryFilters,
} from "@/lib/firestore/transactions";
import type { Transaction, TransactionFilters } from "@/types/transaction";

interface FetchState {
  key: string;
  transactions: Transaction[];
  truncated: boolean;
}

const EMPTY_STATE: FetchState = { key: "", transactions: [], truncated: false };

export function useTransactions(filters: TransactionFilters, pageSize: number) {
  const { user } = useAuth();
  const { refreshKey } = useDataRefresh();
  const [state, setState] = useState<FetchState>(EMPTY_STATE);
  const [pageState, setPageState] = useState<{ key: string; page: number }>({
    key: "",
    page: 0,
  });

  const queryFilters: TransactionQueryFilters = {
    month: filters.month,
    year: filters.year,
    type: filters.type,
    categoryId: filters.categoryId,
  };
  const fetchKey = JSON.stringify({ uid: user?.uid ?? null, queryFilters, refreshKey });
  const pageKey = `${fetchKey}|${filters.search}`;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchAllTransactionsForFilters(user.uid, queryFilters).then(({ transactions, truncated }) => {
      if (!cancelled) setState({ key: fetchKey, transactions, truncated });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey, user]);

  const loading = Boolean(user) && state.key !== fetchKey;
  const rawTransactions = state.key === fetchKey ? state.transactions : [];

  const search = filters.search.trim().toLowerCase();
  const filtered = search
    ? rawTransactions.filter((t) => t.description.toLowerCase().includes(search))
    : rawTransactions;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = pageKey === pageState.key ? pageState.page : 0;
  const clampedPage = Math.min(page, totalPages - 1);
  const pageTransactions = filtered.slice(
    clampedPage * pageSize,
    clampedPage * pageSize + pageSize
  );

  function setPage(p: number) {
    setPageState({ key: pageKey, page: p });
  }

  return {
    transactions: pageTransactions,
    totalCount: filtered.length,
    truncated: state.key === fetchKey && state.truncated,
    loading,
    page: clampedPage,
    totalPages,
    setPage,
    allFilteredForExport: filtered,
  };
}
