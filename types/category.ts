export type CategoryType = "expense" | "income" | "investment";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  plannedBudget: number;
  notes: string | null;
  transactionCount: number;
  createdAt: number;
  updatedAt: number;
}

export type CategoryInput = {
  name: string;
  type: CategoryType;
  plannedBudget: number;
  notes: string | null;
};
