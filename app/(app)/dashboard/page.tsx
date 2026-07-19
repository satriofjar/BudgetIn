"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBreakdownTable } from "@/components/dashboard/category-breakdown-table";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { PeriodPicker } from "@/components/dashboard/period-picker";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { YearlySavingsSummary } from "@/components/dashboard/yearly-savings-summary";
import { YearlyTable } from "@/components/dashboard/yearly-table";
import { useMonthlySummary } from "@/hooks/use-monthly-summary";
import { useYearlySummary } from "@/hooks/use-yearly-summary";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export default function DashboardPage() {
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const { summary: monthlySummary, loading: monthlyLoading } = useMonthlySummary(year, month);
  const { summary: yearlySummary, loading: yearlyLoading } = useYearlySummary(year);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <PeriodPicker
          view={view}
          onViewChange={setView}
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
      </div>

      {view === "monthly" ? (
        monthlyLoading || !monthlySummary ? (
          <DashboardSkeleton />
        ) : (
          <>
            <SummaryCards
              income={monthlySummary.income}
              expense={monthlySummary.expense}
              investment={monthlySummary.investment}
              saldoBulanIni={monthlySummary.saldoBulanIni}
              totalSaving={monthlySummary.totalSaving}
              excessFunMoney={monthlySummary.excessFunMoney}
            />
            <ExpensePieChart rows={monthlySummary.breakdown.expense} />
            <div className="flex flex-col gap-4">
              <CategoryBreakdownTable
                title="Expense"
                type="expense"
                rows={monthlySummary.breakdown.expense}
              />
              <CategoryBreakdownTable
                title="Income"
                type="income"
                rows={monthlySummary.breakdown.income}
              />
              <CategoryBreakdownTable
                title="Investment"
                type="investment"
                rows={monthlySummary.breakdown.investment}
              />
            </div>
          </>
        )
      ) : yearlyLoading || !yearlySummary ? (
        <DashboardSkeleton />
      ) : (
        <>
          <TrendChart
            income={yearlySummary.income.monthlyTotals}
            expense={yearlySummary.expense.monthlyTotals}
            investment={yearlySummary.investment.monthlyTotals}
          />
          <YearlySavingsSummary
            totalSavingByMonth={yearlySummary.totalSavingByMonth}
            excessFunMoneyByMonth={yearlySummary.excessFunMoneyByMonth}
            totalSavingYear={yearlySummary.totalSavingYear}
            excessFunMoneyYear={yearlySummary.excessFunMoneyYear}
          />
          <div className="flex flex-col gap-4">
            <YearlyTable title="Expense" table={yearlySummary.expense} />
            <YearlyTable title="Income" table={yearlySummary.income} />
            <YearlyTable title="Investment" table={yearlySummary.investment} />
          </div>
        </>
      )}
    </div>
  );
}
