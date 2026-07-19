import {
  fetchTransactionsInRange,
  sumAmountBefore,
  sumAmountInRange,
} from "@/lib/firestore/transactions";
import { monthRange, yearRange } from "@/lib/utils/dates";
import type { Category, CategoryType } from "@/types/category";
import type {
  CategoryBreakdownRow,
  MonthlySummary,
  YearlySummary,
  YearlyMonthRow,
  YearlyTypeTable,
} from "@/types/dashboard";
import type { Transaction } from "@/types/transaction";

export async function computeCarryOverBalance(userId: string, year: number, month: number) {
  const { start } = monthRange(year, month);
  const [income, expense, investment] = await Promise.all([
    sumAmountBefore(userId, "income", start),
    sumAmountBefore(userId, "expense", start),
    sumAmountBefore(userId, "investment", start),
  ]);
  return income - expense - investment;
}

function buildBreakdown(
  transactions: Transaction[],
  categories: Category[],
  type: CategoryType
): CategoryBreakdownRow[] {
  return categories
    .filter((c) => c.type === type)
    .map((cat) => {
      const actual = transactions
        .filter((t) => t.categoryId === cat.id)
        .reduce((total, t) => total + t.amount, 0);
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        planned: cat.plannedBudget,
        actual,
        diff: cat.plannedBudget - actual,
      };
    });
}

export async function computeMonthlySummary(
  userId: string,
  year: number,
  month: number,
  categories: Category[]
): Promise<MonthlySummary> {
  const { start, end } = monthRange(year, month);
  const [income, expense, investment, carryOverBalance, monthTransactions] = await Promise.all([
    sumAmountInRange(userId, "income", start, end),
    sumAmountInRange(userId, "expense", start, end),
    sumAmountInRange(userId, "investment", start, end),
    computeCarryOverBalance(userId, year, month),
    fetchTransactionsInRange(userId, start, end),
  ]);

  const totalSaving = income - expense;
  const excessFunMoney = income - expense - investment;
  const saldoBulanIni = carryOverBalance + income - expense - investment;

  return {
    income,
    expense,
    investment,
    carryOverBalance,
    saldoBulanIni,
    totalSaving,
    excessFunMoney,
    breakdown: {
      expense: buildBreakdown(monthTransactions, categories, "expense"),
      income: buildBreakdown(monthTransactions, categories, "income"),
      investment: buildBreakdown(monthTransactions, categories, "investment"),
    },
  };
}

function buildYearlyTypeTable(
  transactions: Transaction[],
  categories: Category[],
  type: CategoryType
): YearlyTypeTable {
  const typeCategories = categories.filter((c) => c.type === type);
  const months: YearlyMonthRow[] = Array.from({ length: 12 }, (_, m) => {
    const categoryTotals: Record<string, number> = {};
    let total = 0;
    for (const cat of typeCategories) {
      const catTotal = transactions
        .filter((t) => t.categoryId === cat.id && new Date(t.date).getMonth() === m)
        .reduce((s, t) => s + t.amount, 0);
      categoryTotals[cat.id] = catTotal;
      total += catTotal;
    }
    return { month: m, categoryTotals, total };
  });
  const monthlyTotals = months.map((m) => m.total);
  const yearTotal = monthlyTotals.reduce((a, b) => a + b, 0);

  return {
    categories: typeCategories.map((c) => ({ id: c.id, name: c.name })),
    months,
    yearTotal,
    monthlyTotals,
  };
}

export async function computeYearlySummary(
  userId: string,
  year: number,
  categories: Category[]
): Promise<YearlySummary> {
  const { start, end } = yearRange(year);
  const transactions = await fetchTransactionsInRange(userId, start, end);

  const expense = buildYearlyTypeTable(transactions, categories, "expense");
  const income = buildYearlyTypeTable(transactions, categories, "income");
  const investment = buildYearlyTypeTable(transactions, categories, "investment");

  const totalSavingByMonth = income.monthlyTotals.map((inc, i) => inc - expense.monthlyTotals[i]);
  const excessFunMoneyByMonth = income.monthlyTotals.map(
    (inc, i) => inc - expense.monthlyTotals[i] - investment.monthlyTotals[i]
  );

  return {
    expense,
    income,
    investment,
    totalSavingByMonth,
    excessFunMoneyByMonth,
    totalSavingYear: totalSavingByMonth.reduce((a, b) => a + b, 0),
    excessFunMoneyYear: excessFunMoneyByMonth.reduce((a, b) => a + b, 0),
  };
}
