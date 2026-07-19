"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { subscribeCategories } from "@/lib/firestore/categories";
import type { Category, CategoryType } from "@/types/category";

interface CategoriesState {
  userId: string | null;
  categories: Category[];
}

export function useCategories() {
  const { user } = useAuth();
  const [state, setState] = useState<CategoriesState>({ userId: null, categories: [] });

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeCategories(user.uid, (data) => {
      setState({ userId: user.uid, categories: data });
    });
    return unsubscribe;
  }, [user]);

  const currentUserId = user?.uid ?? null;
  const loading = Boolean(user) && state.userId !== currentUserId;
  const categories = state.userId === currentUserId ? state.categories : [];

  return { categories, loading };
}

export function useCategoriesByType(type: CategoryType) {
  const { categories, loading } = useCategories();
  return { categories: categories.filter((c) => c.type === type), loading };
}
