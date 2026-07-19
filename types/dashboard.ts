import type { CategoryType } from "./category";

export interface CategoryBreakdownRow {
  categoryId: string;
  categoryName: string;
  planned: number;
  actual: number;
  diff: number;
}

export interface MonthlySummary {
  income: number;
  expense: number;
  investment: number;
  carryOverBalance: number;
  saldoBulanIni: number;
  totalSaving: number;
  excessFunMoney: number;
  breakdown: Record<CategoryType, CategoryBreakdownRow[]>;
}

export interface YearlyMonthRow {
  month: number;
  categoryTotals: Record<string, number>;
  total: number;
}

export interface YearlyTypeTable {
  categories: { id: string; name: string }[];
  months: YearlyMonthRow[];
  yearTotal: number;
  monthlyTotals: number[];
}

export interface YearlySummary {
  expense: YearlyTypeTable;
  income: YearlyTypeTable;
  investment: YearlyTypeTable;
  totalSavingByMonth: number[];
  excessFunMoneyByMonth: number[];
  totalSavingYear: number;
  excessFunMoneyYear: number;
}
