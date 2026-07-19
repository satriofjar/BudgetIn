import type { CategoryType } from "./category";

export interface Transaction {
  id: string;
  date: number;
  type: CategoryType;
  categoryId: string;
  description: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

export type TransactionInput = {
  date: number;
  type: CategoryType;
  categoryId: string;
  description: string;
  amount: number;
};

export interface TransactionFilters {
  month: number | null;
  year: number | null;
  type: CategoryType | null;
  categoryId: string | null;
  search: string;
}
