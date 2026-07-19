"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { MONTH_NAMES } from "@/lib/utils/dates";
import type { CategoryType } from "@/types/category";
import type { TransactionFilters } from "@/types/transaction";

const TYPE_LABELS: Record<CategoryType, string> = {
  expense: "Expense",
  income: "Income",
  investment: "Investment",
};

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 4 + i);

interface TransactionFiltersBarProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export function TransactionFiltersBar({ filters, onChange }: TransactionFiltersBarProps) {
  const { categories } = useCategories();
  const categoryOptions = filters.type
    ? categories.filter((c) => c.type === filters.type)
    : categories;

  function update(partial: Partial<TransactionFilters>) {
    onChange({ ...filters, ...partial });
  }

  function clearAll() {
    onChange({ month: null, year: null, type: null, categoryId: null, search: "" });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.month === null ? "all" : String(filters.month)}
        onValueChange={(v) => v && update({ month: v === "all" ? null : Number(v) })}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Month">
            {(value: string) => (value === "all" ? "All months" : MONTH_NAMES[Number(value)])}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All months</SelectItem>
          {MONTH_NAMES.map((name, i) => (
            <SelectItem key={name} value={String(i)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.year === null ? "all" : String(filters.year)}
        onValueChange={(v) => v && update({ year: v === "all" ? null : Number(v) })}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Year">
            {(value: string) => (value === "all" ? "All years" : value)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All years</SelectItem>
          {YEAR_OPTIONS.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type ?? "all"}
        onValueChange={(v) =>
          v &&
          update({
            type: v === "all" ? null : (v as CategoryType),
            categoryId: null,
          })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Type">
            {(value: string) =>
              value === "all" ? "All types" : TYPE_LABELS[value as CategoryType]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.categoryId ?? "all"}
        onValueChange={(v) => v && update({ categoryId: v === "all" ? null : v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Category">
            {(value: string) =>
              value === "all"
                ? "All categories"
                : (categories.find((c) => c.id === value)?.name ?? value)
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categoryOptions.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={clearAll}>
        <X className="size-4" />
        Clear
      </Button>
    </div>
  );
}
